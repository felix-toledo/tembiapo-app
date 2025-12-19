import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token"); // Fixed: underscore not dash

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "No session token found" },
        { status: 401 }
      );
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACK_URL || "http://localhost:3001/api/v1";

    const response = await fetch(`${backendUrl}/profile/complete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken.value}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error completing profile:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
