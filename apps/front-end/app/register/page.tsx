"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    // Datos de Person
    name: "",
    lastName: "",
    dni: "",
    // Datos de User
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validación del lado del cliente
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    // Validar DNI (8 dígitos)
    if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = "El DNI debe tener exactamente 8 dígitos";
    }

    // Validar username
    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    }

    // Validar email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validar password
    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Validar confirmación de contraseña
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validar
    if (!validateForm()) {
      setMessage({ type: "error", text: "Por favor corrige los errores en el formulario" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage({ type: "success", text: "Registro exitoso. Redirigiendo al login..." });
        // Limpiar formulario
        setFormData({
          name: "",
          lastName: "",
          dni: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        // Redirigir a login después de 2 segundos
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setMessage({
          type: "error",
          text: data?.message || `Error en el registro: ${res.status}`,
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b bg-white/80 dark:bg-zinc-900/80">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="text-xl font-bold">TEMBIAPÓ</div>
        </div>
      </header>

      <main className="flex grow items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900">
          <h1 className="mb-2 text-3xl font-serif">Registrarse como Profesional</h1>
          <p className="mb-6 text-gray-600">Completa el formulario para crear tu cuenta</p>

          {message && (
            <div
              className={`mb-6 rounded-md p-4 ${
                message.type === "error"
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-green-50 text-green-800 border border-green-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección: Datos Personales */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Datos Personales
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full rounded-md border px-3 py-2 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`block w-full rounded-md border px-3 py-2 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  DNI (8 dígitos) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  maxLength={8}
                  placeholder="12345678"
                  className={`block w-full rounded-md border px-3 py-2 ${
                    errors.dni ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.dni && <p className="mt-1 text-sm text-red-600">{errors.dni}</p>}
              </div>
            </div>

            {/* Sección: Datos de Usuario */}
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Datos de Usuario
              </h2>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre de Usuario <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full rounded-md border px-3 py-2 ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-md border px-3 py-2 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full rounded-md border px-3 py-2 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirmar Contraseña <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full rounded-md border px-3 py-2 ${
                      errors.confirmPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 border-t pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Registrando..." : "Registrarse"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="rounded-md border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50"
              >
                Ya tengo cuenta
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
