import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const backendRes = await fetch("http://localhost:3001/api/v1/service-areas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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
    const body = await request.json();
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh-token");

    const backendRes = await fetch("http://localhost:3001/api/v1/service-areas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh-token=${refreshToken?.value}`,
      },
      body: JSON.stringify(body),
    });

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
