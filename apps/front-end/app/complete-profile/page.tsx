"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OurButton from "@/src/components/ui/OurButton";
import { toast } from "react-toastify";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [dni, setDni] = useState("");
  const [username, setUsername] = useState("");
  const [requiresUsername, setRequiresUsername] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if username is required from sessionStorage
    const needsUsername = sessionStorage.getItem("requiresUsername") === "true";
    setRequiresUsername(needsUsername);
  }, []);

  const validateDNI = (value: string) => {
    // DNI debe ser numérico y máximo 11 caracteres
    if (!/^[0-9]*$/.test(value)) {
      return "El DNI debe contener solo números";
    }
    if (value.length > 11) {
      return "El DNI debe tener máximo 11 caracteres";
    }
    return "";
  };

  const validateUsername = (value: string) => {
    // Username: min 3 chars, alphanumeric + underscores/dots
    if (value.length < 3) {
      return "El username debe tener al menos 3 caracteres";
    }
    if (!/^[a-zA-Z0-9._]+$/.test(value)) {
      return "El username solo puede contener letras, números, puntos y guiones bajos";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    const dniError = validateDNI(dni);
    if (dniError) {
      toast.error(dniError);
      return;
    }

    if (requiresUsername) {
      const usernameError = validateUsername(username);
      if (usernameError) {
        toast.error(usernameError);
        return;
      }
    }

    setLoading(true);

    try {
      const body: { dni: string; username?: string } = { dni };
      if (requiresUsername && username) {
        body.username = username;
      }

      const response = await fetch("/api/profile/complete", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Perfil completado exitosamente!");
        sessionStorage.removeItem("requiresUsername");
        setTimeout(() => router.push("/"), 1000);
      } else {
        const errorMessage =
          data?.data?.message || data?.error || "Error al completar el perfil";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al completar el perfil. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 border border-gray-100">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif text-parana-profundo font-bold mb-2">
            Completa tu Perfil
          </h1>
          <p className="text-gray-500">
            {requiresUsername
              ? "El nombre de usuario generado de tu email ya está en uso. Por favor elige uno diferente y proporciona tu DNI."
              : "Por favor proporciona tu DNI para continuar"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DNI
            </label>
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all bg-gray-50 text-gray-900"
              placeholder="Ej: 12345678"
              required
              maxLength={11}
            />
            <p className="mt-1 text-xs text-gray-500">
              Solo números, máximo 11 caracteres
            </p>
          </div>

          {requiresUsername && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all bg-gray-50 text-gray-900"
                placeholder="Ej: usuario123"
                required
                minLength={3}
              />
              <p className="mt-1 text-xs text-gray-500">
                Mínimo 3 caracteres, letras, números, puntos y guiones bajos
              </p>
            </div>
          )}

          <div className="pt-2">
            <div className="w-full h-12">
              <OurButton
                frontColor="var(--color-parana-profundo)"
                textColor="var(--color-blanco-puro)"
                shadowColor="var(--color-gris-oscuro)"
                outlineColor="var(--color-parana-profundo)"
              >
                {loading ? "Guardando..." : "COMPLETAR PERFIL"}
              </OurButton>
            </div>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            ℹ️ Esta información es necesaria para crear tu perfil profesional y
            poder verificar tu identidad.
          </p>
        </div>
      </div>
    </div>
  );
}
