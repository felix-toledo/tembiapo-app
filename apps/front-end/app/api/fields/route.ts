import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const getBaseUrl = () => {
  const rawUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";
  return rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;
};

export async function GET(req: Request) {
  try {
    const baseUrl = getBaseUrl();
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const cookieHeader = req.headers.get("cookie") || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const backendRes = await fetch(`${baseUrl}/fields`, {
      method: "GET",
      headers,
    });

    if (!backendRes.ok) {
      if (backendRes.status === 401) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
      }
    }

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error in fields proxy:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener rubros" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const baseUrl = getBaseUrl();
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    // Authorization header from client might contain the token if we send it manually,
    // but typically safely relying on the httpOnly cookie for server-side calls if available.
    // However, the user said "acordate que necesito pasarle mi sesion token".
    // The previous implementation reads from cookie store.

    const body = await req.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const backendRes = await fetch(`${baseUrl}/fields`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error in fields proxy POST:", error);
    return NextResponse.json(
      { success: false, message: "Error creating field" },
      { status: 500 }
    );
  }
}
