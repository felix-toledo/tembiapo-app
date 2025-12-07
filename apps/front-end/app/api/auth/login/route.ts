import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Forward incoming JSON body
    const body = await req.json().catch(() => null);

    // Forward cookies from the browser (if any)
    const cookie = req.headers.get("cookie") || "";

    const backendRes = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = backendRes.headers.get("content-type") || "application/json";
    const text = await backendRes.text();

    // Forward Set-Cookie header from backend to browser so httpOnly cookies are stored
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
    return NextResponse.json({ message: "Error proxy al backend", error: String(err) }, { status: 500 });
  }
}
