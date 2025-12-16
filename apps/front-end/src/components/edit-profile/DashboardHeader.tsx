"use client";

import { EyeIcon } from 'lucide-react';

interface Props {
  name: string;
  profession: string;
}

export const DashboardHeader = ({ name, profession }: Props) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      
      {/* Títulos */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
          {name}
        </h1>
        <p className="text-xl text-gray-500 font-medium uppercase tracking-wide">
          {profession}
        </p>
      </div>

      {/* Botón Vista Previa */}
      <button 
        onClick={() => console.log("Ir a vista previa")}
        className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-black transition-all text-gray-700 hover:text-black"
      >
        <EyeIcon size={18} className="text-gray-400 group-hover:text-black transition-colors" />
        <span className="font-medium">Vista previa de perfil</span>
      </button>
      
    </div>
  );
};