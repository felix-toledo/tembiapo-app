import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Importamos cookies de Next.js

// Configuración de URL base
const getBaseUrl = () => {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";
  return rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
};

// --- MÉTODO GET (Para leer datos) ---
export async function GET(req: Request) {
  return handleProxy(req, "GET");
}

// --- MÉTODO PUT (Para guardar datos) ---
export async function PUT(req: Request) {
  return handleProxy(req, "PUT");
}

// --- FUNCIÓN HELPER (Para no repetir lógica) ---
async function handleProxy(req: Request, method: string) {
  try {
    const baseUrl = getBaseUrl();
    
    // 1. Obtener la tienda de cookies de Next.js
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    
    // 2. Obtener el string crudo de cookies (para reenviar todo si hace falta)
    const cookieHeader = req.headers.get("cookie") || "";

    // 3. Preparar opciones del fetch
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cookie": cookieHeader,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      cache: "no-store",
    };

    // Si es PUT, agregamos el body
    if (method === "PUT") {
      const body = await req.json();
      fetchOptions.body = JSON.stringify(body);
    }

    // 4. Llamada al Backend
    console.log(`📡 [PROXY ${method}] Enviando petición a: ${baseUrl}/profile/me`);
    
    const backendRes = await fetch(`${baseUrl}/profile/me`, fetchOptions);

    // 5. Manejo de Errores
    if (!backendRes.ok) {
      console.error(`❌ [PROXY ${method}] Error del Backend: ${backendRes.status}`);
      
      if (backendRes.status === 401) {
        return NextResponse.json({ message: "Sesión expirada o inválida" }, { status: 401 });
      }
      
      const errorText = await backendRes.text();
      return NextResponse.json(
        { message: "Error en backend", details: errorText }, 
        { status: backendRes.status }
      );
    }

    // 6. Éxito
    const data = await backendRes.json();
    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    console.error(`🔥 [PROXY ${method}] Error crítico:`, err);
    return NextResponse.json(
      { message: "Error interno del proxy", error: String(err) },
      { status: 500 }
    );
  }
}