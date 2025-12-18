"use client";

import { EyeIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

interface Props {
  name: string;
  profession: string;
  username: string;
  isPremium?: boolean;
  isVerified?: boolean;
}

export const DashboardHeader = ({ name, profession, username, isPremium, isVerified }: Props) => {

  const handleBecomePremium = () => {
    toast.info("¡La membresía Premium estará disponible muy pronto!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      icon: <Sparkles className="text-amber-500" />
    });
  };

  return (
    <div className="mb-8 border-b border-gray-100 pb-8">

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">

        {/* --- Títulos e Identidad --- */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              {name}
            </h1>

            {/* 🏅 INDICADOR PREMIUM (CheckBadgeIcon) */}
            {isPremium && (
              <div className="relative group flex items-center">
                {/* El ícono */}
                <div className="cursor-help transition-transform hover:scale-110">
                  <CheckBadgeIcon className="h-8 w-8 text-amber-400" />
                </div>

                {/* GLOBITO (Tooltip) PERSONALIZADO */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                  <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl relative">
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>

                    <p className="font-semibold text-amber-400 mb-0.5">Usuario Premium</p>
                    <p className="text-gray-300 leading-tight">
                      Próximamente podrás ver y usar todos tus beneficios exclusivos aquí.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-xl text-gray-500 font-medium uppercase tracking-wide">
            {profession}
          </p>
        </div>

        {/* --- Botones de Acción --- */}
        <div className="flex flex-col sm:flex-row items-center gap-3">

          {/* ✨ BOTÓN "HAZTE PREMIUM" */}
          {/* Solo se muestra si está Verificado y NO es Premium */}
          {isVerified && !isPremium && (
            <button
              onClick={handleBecomePremium}
              className="group flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all active:scale-95"
            >
              <Sparkles size={18} className="text-white/90 group-hover:text-white group-hover:animate-pulse" />
              <span className="font-bold tracking-wide text-sm">Hazte Premium</span>
            </button>
          )}

          {/* 👁️ BOTÓN VER PERFIL */}
          <Link
            href={`/profile/${username}`}
            target="_blank"
            className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-black transition-all text-gray-700 hover:text-black shrink-0"
          >
            <EyeIcon size={18} className="text-gray-400 group-hover:text-black transition-colors" />
            <span className="font-medium">Vista del perfil</span>
          </Link>

        </div>

      </div>
    </div>
  );
};