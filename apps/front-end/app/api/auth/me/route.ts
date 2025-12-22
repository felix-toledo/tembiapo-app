import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("session_token")?.value;
    const cookieHeader = req.headers.get("cookie") || "";

    // First attempt with current token
    let backendRes = await fetchUserMe(token, cookieHeader);

    // If 401, try to refresh the token
    if (backendRes.status === 401) {
      const refreshResult = await tryRefreshToken(cookieHeader);

      if (refreshResult.success && refreshResult.newToken) {
        // Retry with new token
        token = refreshResult.newToken;
        backendRes = await fetchUserMe(token, cookieHeader);

        // If successful, set the new session_token cookie
        if (backendRes.status === 200) {
          cookieStore.set("session_token", token, {
            // httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "lax",
            maxAge: 15 * 60, // 15 minutes
          });
        }
      }
    }

    const contentType =
      backendRes.headers.get("content-type") || "application/json";
    const data = await backendRes.text();

    try {
      const json = JSON.parse(data);
      if (json.data && json.data.username) {
        console.log(`[Proxy AuthMe] Authenticated User: ${json.data.username}`);
      }
    } catch {
      // ignore json parse error for logging
    }

    return new Response(data, {
      status: backendRes.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error proxying to backend", error: String(err) },
      { status: 500 }
    );
  }
}

async function fetchUserMe(token: string | undefined, cookieHeader: string) {
  return fetch("http://localhost:3001/api/v1/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Cookie: cookieHeader,
    },
  });
}

async function tryRefreshToken(
  cookieHeader: string
): Promise<{ success: boolean; newToken?: string }> {
  try {
    const refreshRes = await fetch(
      "http://localhost:3001/api/v1/auth/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader, // Forward refresh-token cookie
        },
      }
    );

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      if (refreshData?.data?.accessToken) {
        return { success: true, newToken: refreshData.data.accessToken };
      }
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}
