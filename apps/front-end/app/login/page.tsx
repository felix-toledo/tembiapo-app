"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
        // Redirigir a /dashboard después de login exitoso
        window.location.href = '/dashboard';
        return;
      } else {
        setMessage(data?.message || "Error en login: " + res.status);
      }
    } catch (err) {
      setMessage("No se pudo conectar con el servidor. Revisa CORS y que el backend esté corriendo en http://localhost:3000");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <header className="border-b bg-white/80 dark:bg-zinc-900/80">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="text-xl font-bold">TEMBIAPÓ</div>
        </div>
      </header>

      <main className="flex grow items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-md dark:bg-zinc-900">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <section className="flex flex-col items-center justify-center border-r pr-6 md:pr-10 md:items-start">
              <div className="w-full max-w-sm">
                <h2 className="mb-6 text-sm font-medium text-gray-600">Inicia de manera más rápida</h2>

                <button
                  type="button"
                  className="mb-6 inline-flex w-full items-center justify-center gap-3 rounded-md border px-4 py-3 text-sm font-medium hover:bg-gray-100"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.805 10.023h-9.76v3.954h5.587c-.24 1.64-1.31 3.13-2.797 4.03v3.344h4.523C21.23 20.08 23 15.5 23 12c0-.787-.07-1.55-.195-2.308z" fill="#4285F4"/>
                    <path d="M12.045 23c2.906 0 5.342-.96 7.123-2.6l-4.523-3.344c-1.254.84-2.86 1.34-4.6 1.34-3.53 0-6.52-2.38-7.59-5.6H.983v3.52C2.77 20.98 7.11 23 12.045 23z" fill="#34A853"/>
                    <path d="M4.454 13.7a8.01 8.01 0 010-3.4V6.79H.984A11.99 11.99 0 000 12c0 1.96.47 3.82 1.29 5.51l3.164-3.81z" fill="#FBBC05"/>
                    <path d="M12.045 4.6c1.58 0 3.01.54 4.13 1.6l3.09-3.09C17.37 1.14 14.933 0 12.045 0 7.108 0 2.768 2.02.983 5.27l3.47 3.33c1.07-3.22 4.06-5.6 7.59-5.6z" fill="#EA4335"/>
                  </svg>
                  Continuar con Google
                </button>

                <div className="mt-4 text-center text-sm text-gray-500">¿No tienes una cuenta? <a href="#" className="text-indigo-600 hover:underline">Regístrate aquí</a></div>
              </div>
            </section>

            <section className="flex items-center justify-center pl-6 md:pl-10">
              <div className="w-full max-w-sm">
                <h1 className="mb-4 text-3xl font-serif">TEBIAPÓ</h1>
                <p className="mb-6 text-lg text-gray-600">Te damos la bienvenida a Tembiapó</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="tucorreo@ejemplo.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Contraseña"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center text-sm">
                      <input type="checkbox" className="mr-2" />
                      Recordarme
                    </label>
                    <a className="text-sm text-indigo-600 hover:underline" href="#">¿Olvidaste tu contraseña?</a>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                    >
                      {loading ? "Ingresando..." : "INICIAR"}
                    </button>
                  </div>
                </form>

                {message && (
                  <div className="mt-4 text-sm text-center text-red-600">{message}</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
