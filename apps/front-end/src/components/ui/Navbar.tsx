"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import OurButton from "./OurButton";
import UserDisplay from "./UserDisplay";
import { useAuth } from "@/src/context/AuthContext";

export function Navbar({ wantButtons = true }: { wantButtons?: boolean }) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfessionalPopup, setShowProfessionalPopup] = useState(false);
  const { professional } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  console.log("router", router);
  const isPendingProfessional = !!(
    user &&
    user.role.toUpperCase() === "PROFESSIONAL" &&
    !professional
  );

  // Mostrar popup automáticamente cuando isPendingProfessional es true
  useEffect(() => {
    if (isPendingProfessional) {
      // Delay para que el usuario vea la página primero
      const timer = setTimeout(() => {
        setShowProfessionalPopup(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPendingProfessional]);

  const handleCreateProfessional = () => {
    setShowProfessionalPopup(false);
    router.push("/create-professional");
  };

  const handleLater = () => {
    setShowProfessionalPopup(false);
  };

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false); // Cerramos el menú al salir
  };

  return (
    <>
      <nav className="w-full border-b border-gray-200 bg-white relative z-50">
        <div className="container mx-auto px-4 py-4 flex flex-row justify-between items-center">
          <Link
            href="/"
            className="text-xl md:text-2xl font-serif font-bold tracking-tight flex items-center text-gray-900"
          >
            <Image
              src="/isotipo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-8 h-8 md:w-[50px] md:h-[50px]"
            />
            <div className="block">
              <span className="ml-2 font-primary text-parana-profundo">
                TEMBI
              </span>
              <span className="ml-px font-primary text-tierra-activa">APP</span>
              <span className="ml-px font-primary text-parana-profundo">Ó</span>
            </div>
          </Link>

          {/* --- DESKTOP MENU (Oculto en móvil) --- */}
          <div className="hidden md:flex gap-4 items-center">
            {wantButtons && !user && (
              <>
                <Link href="/login" className="w-auto">
                  <OurButton
                    frontColor="var(--color-gris-fondo-claro)"
                    textColor="var(--color-parana-profundo)"
                    shadowColor="#d1d5db"
                    edgeColor="linear-gradient(to right, #d1d5db 0%, #f3f4f6 8%, #d1d5db 92%, #f3f4f6 100%)"
                    outlineColor="transparent"
                  >
                    Iniciar Sesión
                  </OurButton>
                </Link>
                <Link href="/register" className="w-auto">
                  <OurButton
                    frontColor="var(--color-tierra-activa)"
                    textColor="var(--color-blanco-puro)"
                    shadowColor="#c2410b"
                    outlineColor="var(--color-tierra-activa)"
                  >
                    Registrarse
                  </OurButton>
                </Link>
              </>
            )}
            {user && (
              <>
                <div
                  className={isPendingProfessional ? "animate-pulse-glow" : ""}
                >
                  <UserDisplay
                    user={user}
                    isPendingProfessional={isPendingProfessional}
                  />
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-parana-profundo hover:bg-gray-100 hover:text-tierra-activa transition-colors duration-200"
                  title="Cerrar Sesión"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* --- BOTÓN HAMBURGUESA (Solo móvil) --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 text-gray-600 hover:text-gray-900 focus:outline-none relative ${
                isPendingProfessional && user
                  ? "animate-pulse-glow rounded-lg"
                  : ""
              }`}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              {/* Badge de notificación en hamburguesa */}
              {isPendingProfessional && user && !isMobileMenuOpen && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-tierra-activa rounded-full border-2 border-white animate-ping" />
              )}
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU DROPDOWN --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-6 flex flex-col items-center gap-6 animate-in slide-in-from-top-2 duration-200">
            {wantButtons && !user && (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <OurButton
                    frontColor="var(--color-gris-fondo-claro)"
                    textColor="var(--color-parana-profundo)"
                    shadowColor="#d1d5db"
                    edgeColor="linear-gradient(to right, #d1d5db 0%, #f3f4f6 8%, #d1d5db 92%, #f3f4f6 100%)"
                    outlineColor="transparent"
                  >
                    Iniciar Sesión
                  </OurButton>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <OurButton
                    frontColor="var(--color-tierra-activa)"
                    textColor="var(--color-blanco-puro)"
                    shadowColor="#c2410b"
                    outlineColor="var(--color-tierra-activa)"
                  >
                    Registrarse
                  </OurButton>
                </Link>
              </>
            )}

            {user && (
              <div className="flex flex-col items-center gap-4 w-full">
                {/* En móvil centramos el UserDisplay */}
                <div
                  className={`px-4 ${isPendingProfessional ? "animate-pulse-glow rounded-lg" : ""}`}
                >
                  <UserDisplay
                    user={user}
                    isPendingProfessional={isPendingProfessional}
                  />
                </div>

                <div className="h-px w-1/2 bg-gray-200 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-parana-profundo font-medium hover:text-tierra-activa transition-colors"
                >
                  <span>Cerrar Sesión</span>
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
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* --- POPUP PROFESIONAL PENDIENTE --- */}
      {showProfessionalPopup &&
        isPendingProfessional &&
        pathname !== "/create-professional" && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-in zoom-in-95 duration-300">
              {/* Icono decorativo */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-linear-to-br from-tierra-activa to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
              </div>

              {/* Título */}
              <h2 className="text-xl md:text-2xl font-bold text-parana-profundo text-center mb-3">
                ¡Completá tu perfil profesional! 🚀
              </h2>

              {/* Mensaje */}
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                Si sos profesional o tenés algún servicio que ofrecer, creá tu
                perfil dando click acá.
                <span className="block mt-2 text-sm text-gray-500">
                  También podés hacerlo más tarde desde tu ícono de usuario
                  arriba a la derecha.
                </span>
              </p>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <OurButton
                  frontColor="var(--color-tierra-activa)"
                  textColor="var(--color-blanco-puro)"
                  shadowColor="#c2410b"
                  outlineColor="var(--color-tierra-activa)"
                  onClick={handleCreateProfessional}
                >
                  Crear ahora
                </OurButton>
                <OurButton
                  frontColor="var(--color-gris-fondo-claro)"
                  textColor="var(--color-parana-profundo)"
                  shadowColor="#d1d5db"
                  edgeColor="linear-gradient(to right, #d1d5db 0%, #f3f4f6 8%, #d1d5db 92%, #f3f4f6 100%)"
                  outlineColor="transparent"
                  onClick={handleLater}
                >
                  Más tarde
                </OurButton>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
