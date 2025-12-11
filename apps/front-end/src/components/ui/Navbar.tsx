"use client";

import Link from "next/link";
import Image from "next/image";

import OurButton from "./OurButton";
import UserDisplay from "./UserDisplay";
import { useAuth } from "@/src/context/AuthContext";

export function Navbar({ wantButtons = true }: { wantButtons?: boolean }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="w-full border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex flex-row justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-serif font-bold tracking-tight flex items-center text-gray-900"
        >
          <Image src="/isotipo.png" alt="Logo" width={50} height={50} />
          <span className="ml-2 font-primary text-parana-profundo">TEMBI</span>
          <span className="ml-px font-primary text-tierra-activa">APP</span>
          <span className="ml-px font-primary text-parana-profundo">Ó</span>
        </Link>

        {/* Botones de Acción */}
        <div className="flex gap-4">
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
                  shadowColor="#c2410b" /* Darker orange for shadow */
                  outlineColor="var(--color-tierra-activa)"
                >
                  Registrarse
                </OurButton>
              </Link>
            </>
          )}
          {user && (
            <>
              <UserDisplay user={user} />
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-parana-profundo hover:bg-gray-100 hover:text-tierra-activa transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-parana-profundo focus:ring-offset-2"
                title="Cerrar Sesión"
                aria-label="Cerrar Sesión"
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
      </div>
    </nav>
  );
}
