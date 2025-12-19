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

    const backendRes = await fetch(`${baseUrl}/service-areas`, {
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
    console.error("Error in service-areas proxy:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener áreas de servicio" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const baseUrl = getBaseUrl();
    const body = await request.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const cookieHeader = request.headers.get("cookie") || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const backendRes = await fetch(`${baseUrl}/service-areas`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      if (backendRes.status === 401) {
        return NextResponse.json({ message: "No autorizado" }, { status: 401 });
      }
    }

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error in service-areas POST proxy:", error);
    return NextResponse.json(
      { success: false, message: "Error al crear área de servicio" },
      { status: 500 }
    );
  }
}
