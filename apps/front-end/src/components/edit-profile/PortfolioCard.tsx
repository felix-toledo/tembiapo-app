"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { PortfolioItem } from "@/types";
import { getFullImageUrl } from "@/src/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PortfolioCardProps {
  item: PortfolioItem;
  onDelete: (id: string) => void;
}

// 2. Definimos las variantes de la animación (Slide)
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : direction < 0 ? "-100%" : 0,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export const PortfolioCard = ({ item, onDelete }: PortfolioCardProps) => {
  const [[page, direction], setPage] = useState([0, 0]);

  const images = item.images || [];
  const hasMultipleImages = images.length > 1;

  const imageIndex = Math.abs(page % images.length);
  const currentImage = images[imageIndex];

  // Lógica de URL
  const imgUrl = currentImage ? getFullImageUrl(currentImage.imageUrl) : "";
  const isLocal = imgUrl.includes("localhost") || imgUrl.includes("127.0.0.1");

  // Función para cambiar de imagen
  const paginate = (newDirection: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-gray-100 aspect-4/3 bg-gray-50">
      {/* --- VISOR DE IMÁGENES ANIMADO --- */}
      {images.length > 0 ? (
        <>
          {/* AnimatePresence maneja la salida del componente anterior */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={imgUrl}
                alt={`${item.title} - imagen ${imageIndex + 1}`}
                fill
                className="object-cover"
                unoptimized={isLocal}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
                priority={true}
              />
            </motion.div>
          </AnimatePresence>

          {/* Controles del Carrusel (Solo si hay más de 1 imagen) */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => paginate(-1, e)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10 hover:scale-110 active:scale-95"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={(e) => paginate(1, e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10 hover:scale-110 active:scale-95"
              >
                <ChevronRight size={16} />
              </button>

              {/* Indicador de posición (puntitos) */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300 ${
                      idx === imageIndex
                        ? "bg-white scale-125 w-3"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
          <ImageIcon size={24} />
          <span className="text-xs">Sin fotos</span>
        </div>
      )}

      {/* --- OVERLAY DE INFORMACIÓN --- */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20 pointer-events-none">
        <p className="text-white font-bold truncate text-lg">{item.title}</p>
        <p className="text-white/80 text-xs line-clamp-2">{item.description}</p>

        {/* Botón borrar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="absolute top-2 right-2 p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 pointer-events-auto"
          title="Eliminar proyecto"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};
