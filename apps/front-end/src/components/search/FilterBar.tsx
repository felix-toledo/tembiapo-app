"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Field, ServiceArea } from "../../../types";

interface FilterBarProps {
  fields: Field[];
  areas: ServiceArea[];
}

export function FilterBar({ fields, areas }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Función genérica tipada para actualizar cualquier filtro
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (value && value.trim() !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Título de sección */}
      <div className="flex items-center gap-2">
        <div className="bg-black text-white px-6 py-2 rounded-full font-medium text-sm shadow-md inline-block">
          FILTRAR POR:
        </div>
      </div>

      {/* Grid de Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. FILTRO DE PROFESIÓN (Rubro) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Profesión
          </label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer appearance-none uppercase text-sm"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleFilterChange("field", e.target.value)
            }
            defaultValue={searchParams.get("field") || ""}
          >
            <option value="">Todas</option>
            {fields.map((field) => (
              <option key={field.id} value={field.id}>
                {field.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. FILTRO DE UBICACIÓN (Área) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Ubicación
          </label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer appearance-none uppercase text-sm"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleFilterChange("area", e.target.value)
            }
            defaultValue={searchParams.get("area") || ""}
          >
            <option value="">Cualquiera</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.city}, {area.province}
              </option>
            ))}
          </select>
        </div>

        {/* 3. FILTRO DE VERIFICACIÓN */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Estado
          </label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer appearance-none uppercase text-sm"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleFilterChange("isVerified", e.target.value)
            }
            defaultValue={searchParams.get("isVerified") || ""}
          >
            <option value="">Todos</option>
            <option value="true">Solo Verificados</option>
            <option value="false">Sin Verificar</option>
          </select>
        </div>

        {/* 4. FILTRO DE VALORACIÓN (A MODIFICAR) */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Valoración
          </label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer appearance-none uppercase text-sm"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              handleFilterChange("rating", e.target.value)
            }
            defaultValue={searchParams.get("rating") || ""}
          >
            <option value="">Todas las estrellas</option>
            <option value="5">5 Estrellas (Excelente)</option>
            <option value="4">4+ Estrellas (Muy bueno)</option>
            <option value="3">3+ Estrellas (Bueno)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
