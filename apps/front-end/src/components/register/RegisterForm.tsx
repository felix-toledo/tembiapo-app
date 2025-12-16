"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OurButton from "../ui/OurButton";
import { User, Camera, X } from "lucide-react";
import Image from "next/image";

export function RegisterForm() {
  const router = useRouter();

  // Estados del formulario
  const [formData, setFormData] = useState({
    // Datos de Person
    name: "",
    lastName: "",
    dni: "",
    avatar: null as File | null,
    // Datos de User
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files![0] }));
    const file = e.target.files![0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, avatar: null }));
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validar
    if (!validateForm()) {
      setMessage({
        type: "error",
        text: "Por favor corrige los errores en el formulario",
      });
      return;
    }

    setLoading(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("lastName", formData.lastName);
      dataToSend.append("dni", formData.dni);
      dataToSend.append("username", formData.username);
      dataToSend.append("email", formData.email);
      dataToSend.append("password", formData.password);
      dataToSend.append("confirmPassword", formData.confirmPassword);
      if (formData.avatar) {
        dataToSend.append("avatar", formData.avatar);
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: dataToSend,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Registro exitoso. Redirigiendo al login...",
        });
        // Limpiar formulario
        setFormData({
          name: "",
          lastName: "",
          dni: "",
          avatar: null,
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
          text: data?.error?.message || `Error en el registro: ${res.status}`,
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8 border border-gray-100">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif text-parana-profundo font-bold mb-2">
          Registrarse como Profesional
        </h1>
        <p className="text-gray-500">
          Completa el formulario para crear tu cuenta
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
        {/* Sección: Datos Personales */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-parana-profundo border-b border-gray-200 pb-2">
            Datos Personales
          </h2>

          <div className="flex flex-col items-center justify-center mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto de Perfil (Opcional)
            </label>
            <div className="relative group">
              <div
                className={`w-32 h-32 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  previewUrl
                    ? "border-parana-profundo shadow-lg"
                    : "border-dashed border-gray-300 bg-gray-50 hover:border-parana-profundo hover:bg-white"
                }`}
              >
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400 group-hover:text-parana-profundo transition-colors duration-300" />
                )}
              </div>

              {previewUrl ? (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                  title="Eliminar foto"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-parana-profundo text-white p-2 rounded-full shadow-md hover:bg-opacity-90 transition-colors cursor-pointer"
                  title="Subir foto"
                >
                  <Camera className="w-4 h-4" />
                </label>
              )}
            </div>
            <input
              id="avatar-upload"
              type="file"
              name="avatar"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-tierra-activa">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                  errors.name
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                } focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all`}
                placeholder="Juan"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido <span className="text-tierra-activa">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                  errors.lastName
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                } focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all`}
                placeholder="Pérez"
                required
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              DNI (8 dígitos) <span className="text-tierra-activa">*</span>
            </label>
            <input
              type="number"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              maxLength={8}
              placeholder="12345678"
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                errors.dni
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-50"
              } focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all`}
              required
            />
            {errors.dni && (
              <p className="mt-1 text-sm text-red-600">{errors.dni}</p>
            )}
          </div>
        </div>

        {/* Sección: Datos de Usuario */}
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold text-parana-profundo border-b border-gray-200 pb-2">
            Datos de Usuario
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Usuario <span className="text-tierra-activa">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                errors.username
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-50"
              } focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all`}
              placeholder="juanperez"
              required
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-tierra-activa">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border text-gray-900 ${
                errors.email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-50"
              } focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all`}
              placeholder="tucorreo@ejemplo.com"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña <span className="text-tierra-activa">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border text-gray-900 ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-gray-50"
                  } focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all`}
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña{" "}
                <span className="text-tierra-activa">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 rounded-lg border text-gray-900 ${
                    errors.confirmPassword
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-gray-50"
                  } focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="pt-6 space-y-4 text-center">
          <div className="w-full h-12">
            <OurButton
              frontColor="var(--color-parana-profundo)"
              textColor="var(--color-blanco-puro)"
              shadowColor="var(--color-gris-oscuro)"
              outlineColor="var(--color-parana-profundo)"
            >
              {loading ? "Registrando..." : "REGISTRARSE"}
            </OurButton>
          </div>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center text-gray-500 text-sm">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="text-tierra-activa hover:text-orange-600 font-bold ml-1 transition-colors"
        >
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}
