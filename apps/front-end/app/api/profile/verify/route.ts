import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { optimizeRequestImages } from "@/lib/image-optimization-helper";

export async function POST(req: Request) {
  try {
    // Optimize images before processing
    const optimizedReq = await optimizeRequestImages(req);

    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;

    const formData = await optimizedReq.formData();

    const envUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    // Ensure we don't duplicate /api/v1 if it's already in the env var
    const baseUrl = envUrl.endsWith("/api/v1") ? envUrl : `${envUrl}/api/v1`;

    const backendRes = await fetch(`${baseUrl}/verify/me`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error("Backend error:", backendRes.status, errorText);
      return NextResponse.json(
        { message: "Error en backend", details: errorText },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json(
      { message: "Error proxying to backend", error: String(err) },
      { status: 500 }
    );
  }
}
