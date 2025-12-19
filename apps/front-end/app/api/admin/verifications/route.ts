import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBaseUrl } from "@/lib/api-config";

export async function GET(req: Request) {
  try {
    const baseUrl = getBaseUrl();
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const backendRes = await fetch(`${baseUrl}/verify/admin/all`, {
      method: "GET",
      headers,
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("Error in verifications proxy:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching verifications" },
      { status: 500 }
    );
  }
}
