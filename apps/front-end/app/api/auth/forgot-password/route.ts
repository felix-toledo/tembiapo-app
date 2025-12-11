import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    // Forward to backend
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      }
    );

    const data = await backendRes.json().catch(() => ({}));

    return NextResponse.json(data, {
      status: backendRes.status,
    });
  } catch (err) {
    console.error("Forgot Password Proxy Error:", err);
    return NextResponse.json(
      { message: "Error proxy al backend", error: String(err) },
      { status: 500 }
    );
  }
}
