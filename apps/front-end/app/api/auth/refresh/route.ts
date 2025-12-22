import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";

    const backendRes = await fetch(
      "http://localhost:3001/api/v1/auth/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader, // Forward refresh-token cookie
        },
      }
    );

    const data = await backendRes.json().catch(() => ({}));

    // Create response
    const response = NextResponse.json(data, {
      status: backendRes.status,
    });

    // If refresh succeeded, set the new session_token cookie
    if (backendRes.ok && data?.data?.accessToken) {
      const cookieStore = await cookies();
      cookieStore.set("session_token", data.data.accessToken, {
        // httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "lax",
        maxAge: 15 * 60, // 15 minutes
      });
    }

    return response;
  } catch (err) {
    console.error("Refresh Proxy Error:", err);
    return NextResponse.json(
      { message: "Error proxy al backend", error: String(err) },
      { status: 500 }
    );
  }
}
