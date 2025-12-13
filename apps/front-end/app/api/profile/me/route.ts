import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const cookieHeader = req.headers.get("cookie") || "";

    // Use environment variable if available, else fallback to localhost:3001 as seen in other routes
    const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    // Ensure we don't duplicate /api/v1 if it's already in the env var
    const baseUrl = envUrl.endsWith("/api/v1") ? envUrl : `${envUrl}/api/v1`;

    // Call backend profile/me endpoint
    const backendRes = await fetch(`${baseUrl}/profile/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Cookie: cookieHeader,
      },
    });

    const contentType =
      backendRes.headers.get("content-type") || "application/json";
    const data = await backendRes.text();

    return new Response(data, {
      status: backendRes.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error proxying to backend", error: String(err) },
      { status: 500 }
    );
  }
}
