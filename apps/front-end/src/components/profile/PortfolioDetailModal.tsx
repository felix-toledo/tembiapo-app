"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { PortfolioItem } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: PortfolioItem | null;
}

export const PortfolioDetailModal = ({ isOpen, onClose, item }: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reseteamos el índice de la imagen cuando cambia el item o se abre el modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const images = item.images || [];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex];

  // Navegación del Carrusel
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      {/* Contenedor del Modal */}
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
        {/* Botón Cerrar (Absoluto) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* --- SECCIÓN IMAGEN (Izquierda/Arriba) --- */}
        {/* Agregamos 'overflow-hidden' para que el blur no se salga */}
        <div className="w-full md:w-2/3 h-[40vh] md:h-[80vh] bg-gray-900 relative flex items-center justify-center overflow-hidden">
          {currentImage ? (
            <>
              {/* 1. CAPA DE FONDO (Ambiental) */}
              {/* Usamos la misma imagen, pero con object-cover, blur y opacidad */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={currentImage.imageUrl}
                  alt="background"
                  fill
                  className="object-cover opacity-40 blur-2xl scale-110" // scale evita bordes blancos por el blur
                />
              </div>

              {/* 2. IMAGEN PRINCIPAL (Nítida) */}
              {/* Usamos z-10 para que flote sobre el fondo borroso */}
              <div className="relative w-full h-full z-10 p-4 md:p-8">
                <Image
                  src={currentImage.imageUrl}
                  alt={item.title}
                  fill
                  className="object-contain drop-shadow-2xl" // Sombra para separarla del fondo
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority // Carga prioritaria para el modal
                />
              </div>
            </>
          ) : (
            <div className="text-gray-500 z-10">Sin imagen</div>
          )}

          {/* Flechas de Navegación (Asegúrate de agregar z-20 para que estén ENCIMA de la imagen) */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 z-20 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition-all backdrop-blur-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 z-20 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition-all backdrop-blur-sm"
              >
                <ChevronRight size={24} />
              </button>

              {/* Indicador */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs border border-white/10">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* --- SECCIÓN DETALLES (Derecha/Abajo) --- */}
        <div className="w-full md:w-1/3 p-6 md:p-8 overflow-y-auto bg-white flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {item.title}
          </h2>

          <div className="w-12 h-1 bg-[#E35205] rounded-full mb-6"></div>

          <div className="prose prose-sm text-gray-600 leading-relaxed">
            <p className="whitespace-pre-wrap">{item.description}</p>
          </div>
        </div>
      </div>

      {/* Overlay click para cerrar */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>
    </div>
  );
};
