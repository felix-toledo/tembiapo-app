"use client";

import { useState } from "react";
import Link from "next/link";
import OurButton from "../ui/OurButton";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!email) {
      setMessage({
        type: "error",
        text: "Por favor ingresa tu correo electrónico.",
      });
      return;
    }

    // Validar formato de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({
        type: "error",
        text: "Por favor ingresa un correo electrónico válido.",
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: Implementar llamado a API
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Se ha enviado un enlace de recuperación a tu correo electrónico.",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text:
            data?.message || "Error al procesar la solicitud: " + res.status,
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "No se pudo conectar con el servidor. Revisa tu conexión.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 border border-gray-100">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-parana-profundo/10 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-parana-profundo"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-serif text-parana-profundo font-bold mb-2">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="text-gray-500">
          No te preocupes, te enviaremos instrucciones para recuperarla
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm text-center border ${
            message.type === "error"
              ? "bg-red-50 text-red-600 border-red-100"
              : "bg-green-50 text-green-600 border-green-100"
          }`}
        >
          {message.text}
        </div>
      )}

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
          <p className="mt-2 text-sm text-gray-500">
            Ingresa el correo asociado a tu cuenta y te enviaremos un enlace
            para restablecer tu contraseña.
          </p>
        </div>

        <div className="pt-2">
          <div className="w-full h-12">
            <OurButton
              frontColor="var(--color-parana-profundo)"
              textColor="var(--color-blanco-puro)"
              shadowColor="var(--color-gris-oscuro)"
              outlineColor="var(--color-parana-profundo)"
            >
              {loading ? "Enviando..." : "ENVIAR ENLACE DE RECUPERACIÓN"}
            </OurButton>
          </div>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-tierra-activa hover:text-orange-600 font-medium transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
