import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    // Ensure we don't duplicate /api/v1 if it's already in the env var
    const baseUrl = envUrl.endsWith("/api/v1") ? envUrl : `${envUrl}/api/v1`;

    const backendRes = await fetch(`${baseUrl}/verify/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!backendRes.ok) {
      // If 404, it might mean no verification exists, which returns null in service but let's see.
      // The service throws ForbiddenException('User or person not found') if user/person missing.
      // If verification is null, it returns null (200 OK with null body? or empty string?)
      // AuthContext handles empty text.
      const errorText = await backendRes.text();
      console.error(
        "Backend error fetching verification:",
        backendRes.status,
        errorText
      );
      return NextResponse.json(null, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Proxy error fetching verification:", err);
    return NextResponse.json(
      { message: "Error proxying to backend", error: String(err) },
      { status: 500 }
    );
  }
}
