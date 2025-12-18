/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { usePWAInstall } from "@/src/hooks/usePWAInstall";
import { Download, Share } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export function InstallPWAButton() {
  const { isInstallable, isIOS, isStandalone, isMobile, promptInstall } =
    usePWAInstall();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything on server or if already installed
  if (!mounted || isStandalone) return null;

  // Only show on mobile
  if (!isMobile) return null;

  // Case 1: Android/Chrome (Native Install)
  if (isInstallable) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 w-full flex justify-center mt-6">
        <button
          onClick={promptInstall}
          className="flex items-center gap-2 px-6 py-3 bg-[#E35205] text-white font-medium rounded-full hover:bg-[#c94904] transition-colors shadow-lg shadow-orange-500/20 active:scale-95"
        >
          <Download size={20} />
          Instalar App
        </button>
      </div>
    );
  }

  // Case 2: iOS (Manual Instructions)
  if (isIOS) {
    const showIOSInstructions = () => {
      toast.info(
        <div className="flex flex-col gap-1">
          <span className="font-bold">Para instalar la App:</span>
          <span className="text-sm">
            1. Toca el botón Compartir <Share className="inline w-4 h-4" />
          </span>
          <span className="text-sm">
            2. Selecciona{" "}
            <span className="font-semibold">&quot;Agregar a Inicio&quot;</span>{" "}
            ➕
          </span>
        </div>,
        {
          autoClose: 6000,
          position: "bottom-center",
        }
      );
    };

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 w-full flex justify-center mt-6">
        <button
          onClick={showIOSInstructions}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium rounded-full hover:bg-white/20 transition-colors shadow-lg active:scale-95"
        >
          <Download size={20} />
          Instalar App en iPhone
        </button>
      </div>
    );
  }

  return null;
}
