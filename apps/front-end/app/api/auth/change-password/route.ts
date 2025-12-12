import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.token || !body.password) {
      return NextResponse.json(
        { message: "Faltan datos requeridos (token o password)" },
        { status: 400 }
      );
    }

    // Map frontend payload to backend DTO
    // Frontend: { token, password }
    // Backend: { resetToken, newPassword, confirmPassword }
    const backendPayload = {
      resetToken: body.token,
      newPassword: body.password,
      confirmPassword: body.password, // Backend requires this for validation
    };

    // Forward to backend
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendPayload),
      }
    );

    const data = await backendRes.json().catch(() => ({}));

    return NextResponse.json(data, {
      status: backendRes.status,
    });
  } catch (err) {
    console.error("Change Password Proxy Error:", err);
    return NextResponse.json(
      { message: "Error proxy al backend", error: String(err) },
      { status: 500 }
    );
  }
}
