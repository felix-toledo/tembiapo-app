import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 400 }
      );
    }

    // Set session_token cookie (same name used by other API routes)
    const cookieStore = await cookies();
    cookieStore.set("session_token", accessToken, {
      httpOnly: false, // Allow client to read for logout
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 15, // 15 minutes to match backend
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}
