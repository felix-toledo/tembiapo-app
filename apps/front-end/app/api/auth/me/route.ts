import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const cookieHeader = req.headers.get("cookie") || "";

    const backendRes = await fetch("http://localhost:3001/api/v1/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Cookie: cookieHeader, // Keep for refresh token if needed
      },
    });

    const contentType =
      backendRes.headers.get("content-type") || "application/json";
    const data = await backendRes.text();

    try {
      const json = JSON.parse(data);
      if (json.data && json.data.username) {
        console.log(`[Proxy AuthMe] Authenticated User: ${json.data.username}`);
      }
    } catch (error) {
      // ignore json parse error for logging
    }

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
