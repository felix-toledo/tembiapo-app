'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceArea } from '@tembiapo/db';

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
    
    // IMPORTANTE: Mantenemos el scroll hacia los resultados
    router.push(`/?${params.toString()}#results`, { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-evenly sm:items-center">
      
      {/* 1. FILTRO DE UBICACIÓN */}
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ubicación</label>
        <select 
          className="input-primary"
          onChange={(e) => handleFilterChange('area', e.target.value)}
          defaultValue={searchParams.get('area') || ''}
        >
          <option value="">Cualquiera</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.city}, {area.province}
            </option>
          ))}
        </select>
      </div>

      {/* 2. FILTRO DE VERIFICACIÓN */}
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Estado</label>
        <select 
          className="input-primary"
          onChange={(e) => handleFilterChange('isVerified', e.target.value)}
          defaultValue={searchParams.get('isVerified') || ''}
        >
          <option value="">Todos</option>
          <option value="true">Solo Verificados</option>
          <option value="false">No verificados</option>
        </select>
      </div>

      {/* 3. FILTRO DE VALORACIÓN */}
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Valoración</label>
        <select 
          className="input-primary"
          onChange={(e) => handleFilterChange('rating', e.target.value)}
          defaultValue={searchParams.get('rating') || ''}
        >
          <option value="">Todas</option>
          <option value="5">5 Estrellas</option>
          <option value="4">4+ Estrellas</option>
        </select>
      </div>
    </div>
  );
}