import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Note: Image compression is already done client-side in RegisterForm
    // We just proxy the request to the backend
    const contentTypeHeader = req.headers.get("content-type") || "";
    const cookie = req.headers.get("cookie") || "";

    const headers: HeadersInit = {};
    if (cookie) {
      headers["cookie"] = cookie;
    }

    let body: BodyInit | undefined;

    if (contentTypeHeader.includes("multipart/form-data")) {
      // If it's form-data, we get the formData object
      // and let fetch generate the correct boundary
      const formData = await req.formData();
      body = formData;
      // DO NOT set Content-Type header here, fetch will do it with boundary
    } else {
      // Create JSON body
      const json = await req.json().catch(() => null);
      body = json ? JSON.stringify(json) : undefined;
      headers["Content-Type"] = "application/json";
    }

    const backendRes = await fetch(
      "http://localhost:3001/api/v1/auth/register",
      {
        method: "POST",
        headers: headers,
        body: body,
      }
    );

    const contentType =
      backendRes.headers.get("content-type") || "application/json";
    const text = await backendRes.text();

    // Forward Set-Cookie header from backend to browser if present
    const setCookie = backendRes.headers.get("set-cookie");
    const responseHeaders: HeadersInit = { "content-type": contentType };
    if (setCookie) {
      responseHeaders["set-cookie"] = setCookie;
    }

    return new Response(text, {
      status: backendRes.status,
      headers: responseHeaders,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error proxy al backend", error: String(err) },
      { status: 500 }
    );
  }
}
