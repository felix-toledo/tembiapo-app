"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const titles = [
  {
    id: 1,
    line1: "El oficio que buscas,",
    line2: "a la vuelta de la esquina",
  },
  {
    id: 2,
    line1: "Expertos de confianza,",
    line2: "listos para ayudarte",
  },
  {
    id: 3,
    line1: "Soluciones rápidas,",
    line2: "con talento de tu ciudad",
  },
];

export function HeroTitle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Cambiar el título cada 4 segundos (4000ms)
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 4000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(timer);
  }, []);

  // Configuración de la animación (efecto slide vertical suave)
  const animations = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: "easeInOut" as const }
  };

  return (
    <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-balance drop-shadow-2xl min-h-40 sm:min-h-[180px] md:min-h-[220px] flex flex-col justify-center">
      {/* Usamos AnimatePresence con mode="wait" para que una frase espere a que la otra termine de salir */}
      <AnimatePresence mode="wait">
        <motion.div
          key={titles[index].id} // La key es crucial para que Framer detecte el cambio
          {...animations}
          className="flex flex-col items-center"
        >
          {/* Primera línea (Blanco) */}
          <span>{titles[index].line1}</span>
          
          {/* Segunda línea (Gradiente) + Punto Naranja */}
          <span className="block mt-1 md:mt-2">
             <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-gray-200 to-[#3B5277]">
              {titles[index].line2}
            </span>
            <span className="text-[#E35205]">.</span>
          </span>
        </motion.div>
      </AnimatePresence>
    </h1>
  );
}