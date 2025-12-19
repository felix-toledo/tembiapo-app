"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get("accessToken");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(`Error en autenticación: ${errorParam}`);
        console.error("Google Auth Error:", errorParam);
        setTimeout(() => router.push("/login"), 3000);
        return;
      }

      if (accessToken) {
        try {
          // Set session cookie via API route
          const sessionRes = await fetch("/api/auth/set-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken }),
          });

          if (!sessionRes.ok) {
            throw new Error("Failed to set session");
          }

          // Update Auth Context state
          await login();

          // Redirect to home or dashboard
          router.push("/");
        } catch (err) {
          console.error("Error setting session:", err);
          setError("Error al iniciar sesión. Intenta nuevamente.");
          setTimeout(() => router.push("/login"), 3000);
        }
      } else {
        setError("No se recibió el token de acceso.");
        setTimeout(() => router.push("/login"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, login]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md border border-gray-100 max-w-sm w-full">
        {error ? (
          <>
            <div className="text-red-500 text-xl font-bold mb-2">Error</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-400">Redirigiendo...</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 border-4 border-parana-profundo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Autenticando...
            </h2>
            <p className="text-gray-500">Por favor espera un momento</p>
          </>
        )}
      </div>
    </div>
  );
}
