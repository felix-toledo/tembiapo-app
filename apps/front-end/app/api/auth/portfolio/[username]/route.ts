// apps/front-end/app/api/auth/portfolio/[username]/route.ts

import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Log para confirmar que Next.js encontró el archivo

    const res = await fetch(`${BACKEND_URL}/portfolio/${username}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      // Devolvemos array vacío en vez de error para que la UI no explote
      return NextResponse.json([], { status: 200 });
    }

    const data = await res.json();
    // Tu backend devuelve un array directo, así que lo pasamos tal cual
    const finalData = Array.isArray(data) ? data : data.data || [];

    return NextResponse.json(finalData, { status: 200 });
  } catch (error) {
    console.error("🔥 [PROXY ERROR]", error);
    return NextResponse.json([], { status: 500 });
  }
}
