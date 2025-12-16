import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(req: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";
    const baseUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
    
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const cookieHeader = req.headers.get("cookie") || "";

    const headers: Record<string, string> = { "Cookie": cookieHeader };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const backendRes = await fetch(`${baseUrl}/portfolio/${itemId}`, {
      method: "DELETE",
      headers,
    });

    if (!backendRes.ok) return NextResponse.json({}, { status: backendRes.status });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}