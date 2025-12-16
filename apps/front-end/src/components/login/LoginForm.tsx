"use client";

import { useState } from "react";
import OurButton from "../ui/OurButton";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!email || !password) {
      setMessage("Por favor completa email y contraseña.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        // Sync context
        await login();
        window.location.href = "/";
        return;
      } else {
        setMessage(
          data?.error?.message || "Chequea tus credenciales: " + res.statusText
        );
      }
    } catch {
      setMessage("No se pudo conectar con el servidor. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 border border-gray-100">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif text-parana-profundo font-bold mb-2">
          Bienvenido
        </h1>
        <p className="text-gray-500">Ingresa a tu cuenta para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all bg-gray-50 text-gray-900"
            placeholder="tucorreo@ejemplo.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all bg-gray-50 text-gray-900"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="mr-2 rounded text-parana-profundo focus:ring-parana-profundo"
            />
            Recordarme
          </label>
          <Link
            href="/forgot-password"
            className="text-tierra-activa hover:text-orange-600 font-medium transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="pt-2  text-center">
          <div className="w-full h-12">
            <OurButton
              frontColor="var(--color-parana-profundo)"
              textColor="var(--color-blanco-puro)"
              shadowColor="var(--color-gris-oscuro)"
              outlineColor="var(--color-parana-profundo)"
            >
              {loading ? "Ingresando..." : "INICIAR SESIÓN"}
            </OurButton>
          </div>
        </div>
      </form>

      {message && (
        <div className="mt-6 p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center border border-red-100">
          {message}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="text-tierra-activa hover:text-orange-600 font-bold ml-1 transition-colors"
        >
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
}
