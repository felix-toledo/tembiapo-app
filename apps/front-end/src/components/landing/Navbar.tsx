'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import OurButton from "../ui/OurButton";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export function Navbar() {
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full border-b border-gray-200 py-4 bg-white relative z-50">
      <div className="container mx-auto px-4 flex flex-row justify-between items-center">
        
        {/* --- LOGO --- */}
        <Link
          href="/"
          className="text-2xl font-serif font-bold tracking-tight flex items-center text-gray-900 z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <Image src="/isotipo.png" alt="Logo" width={40} height={40} className="w-10 h-10 sm:w-[50px] sm:h-[50px]" />
          <span className="ml-2 font-primary text-parana-profundo">TEMBI</span>
          <span className="ml-px font-primary text-tierra-activa">APP</span>
          <span className="ml-px font-primary text-parana-profundo">Ó</span>
        </Link>

        {/* --- BOTONES DESKTOP & TABLET --- */}
        <div className="hidden md:flex gap-4 items-center transform md:scale-90 lg:scale-100 origin-right transition-transform duration-200">
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
        </div>

        {/* --- BOTÓN HAMBURGUESA (MÓVIL) --- */}
        {/* Visible solo en móvil (md:hidden) */}
        <button
          className="md:hidden p-2 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-8 w-8" />
          ) : (
            <Bars3Icon className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* --- MENÚ DESPLEGABLE MÓVIL --- */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-6 px-4 flex flex-col gap-4 animate-in slide-in-from-top-5 fade-in duration-200">
          <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full flex justify-center">
             {/* En móvil usamos el botón tal cual, centrado */}
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
          
          <Link href="/register" onClick={() => setIsMenuOpen(false)} className="w-full flex justify-center">
            <OurButton
              frontColor="var(--color-tierra-activa)"
              textColor="var(--color-blanco-puro)"
              shadowColor="#c2410b"
              outlineColor="var(--color-tierra-activa)"
            >
              Registrarse
            </OurButton>
          </Link>
        </div>
      )}
    </nav>
  );
}