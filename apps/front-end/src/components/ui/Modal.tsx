"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // Overlay (Fondo oscuro)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-6 py-4 animate-in fade-in duration-200 overflow-x-hidden overflow-y-auto">
      {/* Contenedor del Modal */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[calc(100vw-2rem)] sm:max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-gray-500 shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (Aquí va el formulario) */}
        <div className="p-4 sm:p-6 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
};
