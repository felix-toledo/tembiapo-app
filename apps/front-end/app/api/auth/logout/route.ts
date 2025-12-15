import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";

    console.log("[Logout API] Llamando al backend...");

    // 1. Call Backend to invalidate Refresh Token with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    let backendRes;
    try {
      backendRes = await fetch("http://localhost:3001/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader, // Forward cookies (refresh-token)
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      console.log("[Logout API] Respuesta del backend:", backendRes.status);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error("[Logout API] Error llamando al backend:", fetchError);
      // Continue anyway to clear frontend cookies
    }

    const data = backendRes ? await backendRes.json().catch(() => ({})) : {};

    // 2. Create Response
    const response = NextResponse.json(
      { success: true, message: "Logout exitoso", ...data },
      { status: 200 }
    );

    // 3. Forward Backend Set-Cookie (to clear refresh-token)
    if (backendRes) {
      const setCookie = backendRes.headers.get("set-cookie");
      if (setCookie) {
        response.headers.set("set-cookie", setCookie);
      }
    }

    // 4. Clear Frontend Session Token
    response.cookies.delete("session_token");

    console.log("[Logout API] Cookies limpiadas, enviando respuesta");

    return response;
  } catch {
    console.error("[Logout API] Error occurred");

    // Even on error, try to clear cookies
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout local exitoso (backend no disponible)",
      },
      { status: 200 }
    );
    response.cookies.delete("session_token");

    return response;
  }
}
