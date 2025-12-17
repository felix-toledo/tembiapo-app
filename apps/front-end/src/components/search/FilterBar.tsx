'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceArea } from '@tembiapo/db';
import { MapPin, ShieldCheck, Star, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  areas: ServiceArea[];
}

export function FilterBar({ areas }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); // Reset paginación

    if (value && value.trim() !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Mantenemos tu lógica exacta de navegación
    router.push(`/?${params.toString()}#results`, { scroll: false });
  };

  // Helper para detectar si un filtro está activo (para cambiar estilos)
  const isActive = (key: string) => !!searchParams.get(key);

  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 mb-8">
      
      {/* Label Móvil / Decorativo */}
      <div className="flex items-center gap-2 mb-4 sm:hidden text-gray-400 font-medium text-sm">
        <SlidersHorizontal size={16} />
        <span>Filtrar resultados por:</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-evenly items-stretch sm:items-center">
        
        {/* 1. FILTRO DE UBICACIÓN */}
        <div className="relative group w-full sm:w-auto min-w-[200px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#E35205] transition-colors pointer-events-none">
            <MapPin size={18} />
          </div>
          <select 
            className={`
              w-full appearance-none bg-white pl-10 pr-10 py-3 rounded-xl border 
              text-sm font-medium text-gray-700 outline-none transition-all cursor-pointer
              focus:ring-2 focus:ring-[#E35205]/20 focus:border-[#E35205]
              ${isActive('area') ? 'border-[#E35205] bg-orange-50/10' : 'border-gray-200 hover:border-gray-300'}
            `}
            onChange={(e) => handleFilterChange('area', e.target.value)}
            defaultValue={searchParams.get('area') || ''}
          >
            <option value="">Todas las ciudades</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.city}, {area.province}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={16} />
          </div>
        </div>

        {/* 2. FILTRO DE VERIFICACIÓN */}
        <div className="relative group w-full sm:w-auto min-w-[180px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-600 transition-colors pointer-events-none">
            <ShieldCheck size={18} />
          </div>
          <select 
            className={`
              w-full appearance-none bg-white pl-10 pr-10 py-3 rounded-xl border 
              text-sm font-medium text-gray-700 outline-none transition-all cursor-pointer
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
              ${isActive('isVerified') ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 hover:border-gray-300'}
            `}
            onChange={(e) => handleFilterChange('isVerified', e.target.value)}
            defaultValue={searchParams.get('isVerified') || ''}
          >
            <option value="">Cualquier estado</option>
            <option value="true">Verificados</option>
            <option value="false">No verificados</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={16} />
          </div>
        </div>

        {/* 3. FILTRO DE VALORACIÓN */}
        <div className="relative group w-full sm:w-auto min-w-[180px]">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-yellow-500 transition-colors pointer-events-none">
            <Star size={18} />
          </div>
          <select 
            className={`
              w-full appearance-none bg-white pl-10 pr-10 py-3 rounded-xl border 
              text-sm font-medium text-gray-700 outline-none transition-all cursor-pointer
              focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500
              ${isActive('rating') ? 'border-yellow-500 bg-yellow-50/10' : 'border-gray-200 hover:border-gray-300'}
            `}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            defaultValue={searchParams.get('rating') || ''}
          >
            <option value="">Cualquier valoración</option>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4+)</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown size={16} />
          </div>
        </div>

      </div>
    </div>
  );
}