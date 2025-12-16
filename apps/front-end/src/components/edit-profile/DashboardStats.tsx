"use client";

import { PlusIcon } from 'lucide-react'; // Asumiendo que usas lucide o heroicons

export const DashboardStats = ({ jobs, rating }: { jobs: number, rating: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Card Trabajos */}
      <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col items-center">
        <h4 className="text-gray-500 font-medium mb-2">Trabajos Realizados</h4>
        <span className="text-5xl font-bold text-gray-900 mb-4">{jobs}</span>
        
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
          <PlusIcon size={16} />
          Cargar Nuevo
        </button>
      </div>

      {/* Card Valoración */}
      <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex flex-col items-center justify-center">
        <h4 className="text-gray-500 font-medium mb-2">Tu Valoración Actual</h4>
        <div className="flex items-center gap-2">
          <span className="text-5xl text-yellow-400">★</span>
          <span className="text-5xl font-bold text-gray-900">{rating}</span>
        </div>
        <span className="text-xs text-gray-400 mt-2">Basado en reseñas de clientes</span>
      </div>
    </div>
  );
};