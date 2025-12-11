import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const cookie = req.headers.get("cookie") || "";

    const backendRes = await fetch("http://localhost:3001/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await backendRes.json().catch(() => ({}));

    // Create response
    const response = NextResponse.json(data, {
      status: backendRes.status,
    });

    // Capture Access Token and set as HTTP-only cookie for the Frontend Server to use
    // Backend returns { success: true, data: { accessToken: string, ... } }
    const accessToken = data?.data?.accessToken;

    if (resOk(backendRes.status) && accessToken) {
      response.cookies.set("session_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 15 * 60, // Match backend 15m
      });
    } else {
      console.log("Login Proxy: AccessToken not found in response", data);
    }

    // Forward backend cookies (like refresh-token) AFTER setting session_token
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      response.headers.append("set-cookie", setCookie);
    }

    return response;
  } catch (err) {
    console.error("Login Proxy Error:", err);
    return NextResponse.json(
      { message: "Error proxy al backend", error: String(err) },
      { status: 500 }
    );
  }
}

function resOk(status: number) {
  return status >= 200 && status < 300;
}
