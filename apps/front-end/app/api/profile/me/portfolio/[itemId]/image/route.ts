import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const rawUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";
    const baseUrl = rawUrl.endsWith("/") ? rawUrl.slice(0, -1) : rawUrl;

    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const cookieHeader = req.headers.get("cookie") || "";

    // Images are already compressed client-side, just extract and forward
    const formData = await req.formData();

    const headers: Record<string, string> = {
      Cookie: cookieHeader,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const backendRes = await fetch(`${baseUrl}/portfolio/${itemId}/image`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!backendRes.ok) throw new Error(await backendRes.text());

    const data = await backendRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
