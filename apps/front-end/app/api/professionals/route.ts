import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendRes = await fetch("http://localhost:3001/api/v1/profile/all-professionals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error in professionals proxy:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener profesionales" },
      { status: 500 }
    );
  }
}
