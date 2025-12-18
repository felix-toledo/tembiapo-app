import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh-token");

    const backendRes = await fetch(`http://localhost:3001/api/v1/service-areas/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh-token=${refreshToken?.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error in service-areas PATCH proxy:", error);
    return NextResponse.json(
      { success: false, message: "Error al actualizar área de servicio" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh-token");

    const backendRes = await fetch(`http://localhost:3001/api/v1/service-areas/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh-token=${refreshToken?.value}`,
      },
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error in service-areas DELETE proxy:", error);
    return NextResponse.json(
      { success: false, message: "Error al eliminar área de servicio" },
      { status: 500 }
    );
  }
}
