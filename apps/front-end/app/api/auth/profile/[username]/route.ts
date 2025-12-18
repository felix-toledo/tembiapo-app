import { NextResponse } from "next/server";

// URL real de tu Backend (NestJS)
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

export async function GET(
  request: Request,
  // En Next.js 15, params es una Promesa
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // 1. El servidor de Next llama al servidor de Nest (Server-to-Server)
    // Aquí NO hay CORS.
    const backendRes = await fetch(`${BACKEND_URL}/profile/${username}`, {
      headers: {
        "Content-Type": "application/json",
        // Si necesitaras pasar cookies de sesión, las extraerías de 'request' y las pondrías aquí
      },
      cache: "no-store", // Para asegurar datos frescos
    });

    const data = await backendRes.json().catch(() => ({}));

    // 2. Devolvemos la respuesta al navegador tal cual vino del backend
    return NextResponse.json(data, {
      status: backendRes.status,
    });
  } catch (err) {
    console.error("Profile Proxy Error:", err);
    return NextResponse.json(
      { message: "Error conectando con el backend", error: String(err) },
      { status: 500 }
    );
  }
}
