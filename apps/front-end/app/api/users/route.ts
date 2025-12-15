import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendRes = await fetch("http://localhost:3001/api/v1/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error in users proxy:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}
