import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const getBaseUrl = () => {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";
  return rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
};

// POST: Crear el Item (Solo texto: Título y Descripción)
export async function POST(req: Request) {
  try {
    const baseUrl = getBaseUrl();
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const cookieHeader = req.headers.get("cookie") || "";

    const body = await req.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cookie": cookieHeader,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const backendRes = await fetch(`${baseUrl}/portfolio`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) throw new Error(await backendRes.text());

    const data = await backendRes.json();
    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// GET: Para leer (Opcional, si quieres leer el portfolio de "me" o pasas username)
// Asumiendo que quieres leer tu propio portfolio
export async function GET(req: Request) {
    // ... Implementación similar a los anteriores, 
    // pero tendrás que decidir si llamas a /portfolio/{mi_username} 
    // o si el backend tiene un endpoint /portfolio/me
    return NextResponse.json({ message: "Use fetch by username" }, { status: 501 });
}