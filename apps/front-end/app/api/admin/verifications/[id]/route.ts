import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBaseUrl } from "@/lib/api-config";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const baseUrl = getBaseUrl();
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const body = await req.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const backendRes = await fetch(`${baseUrl}/verify/admin/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error in verification update proxy:", error);
    return NextResponse.json(
      { success: false, message: "Error updating verification" },
      { status: 500 }
    );
  }
}
