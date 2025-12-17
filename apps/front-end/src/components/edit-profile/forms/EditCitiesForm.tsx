"use client";

import React, { useState } from 'react';
import { UIServiceArea } from '@/types';
import { AreaSelector } from '@/src/components/professional-creation/AreaSelector';
import { ServiceArea } from '@tembiapo/db';

interface Props {
  initialAreas: UIServiceArea[];
  availableOptions: ServiceArea[];
  onSave: (newAreas: UIServiceArea[]) => void;
  onCancel: () => void;
}

export const EditCitiesForm = ({ initialAreas, availableOptions, onSave, onCancel }: Props) => {
  const [selectedAreas, setSelectedAreas] = useState<UIServiceArea[]>(initialAreas);

  // --- LÓGICA DE SELECCIÓN ---

  const toggleArea = (id: string) => {
    const exists = selectedAreas.find((a) => a.id === id);
    if (exists) {
      removeArea(id);
    } else {
      const isFirst = selectedAreas.length === 0;
      
      const areaData = availableOptions.find(a => a.id === id);
      
      if (areaData) {
        const newArea: UIServiceArea = {
             ...areaData,
             country: areaData.country || "Argentina", 
             postalCode: areaData.postalCode || "0000",
             isMain: isFirst 
        };
        setSelectedAreas([...selectedAreas, newArea]);
      }
    }
  };

  const removeArea = (id: string) => {
    const newAreas = selectedAreas.filter((a) => a.id !== id);
    if (newAreas.length > 0 && !newAreas.some((a) => a.isMain)) {
      newAreas[0].isMain = true;
    }
    setSelectedAreas(newAreas);
  };

  const setMainArea = (id: string) => {
    setSelectedAreas(selectedAreas.map((a) => ({ ...a, isMain: a.id === id })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAreas.length === 0) {
      alert("Debes seleccionar al menos un área de servicio");
      return;
    }
    onSave(selectedAreas);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 1. SELECCIONADOR TIPO GRID */}
      <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona tus Áreas de Cobertura
          </label>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 max-h-[300px] overflow-y-auto">
          {/* Reutilizamos tu componente AreaSelector existente */}
          <AreaSelector
            serviceAreas={availableOptions} 
            selectedIds={selectedAreas.map((a) => a.id)}
            onToggle={toggleArea}
          />
        </div>
      </div>

      {/* 2. LISTA DE SELECCIONADOS (GESTIÓN DE PRINCIPAL) */}
      {selectedAreas.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-semibold">
            Áreas seleccionadas <span className="text-gray-400 font-normal">(Marca la principal)</span>
          </p>
          
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
            {selectedAreas.map((sa) => (
              <div
                key={sa.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  sa.isMain
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200 hover:border-blue-200"
                }`}
              >
                <div className="flex flex-col text-left">
                    <span className="font-medium text-gray-800">{sa.city}</span>
                    <span className="text-xs text-gray-500">{sa.province}</span>
                </div>
                
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900 select-none">
                  <input
                    type="radio"
                    checked={sa.isMain}
                    onChange={() => setMainArea(sa.id)}
                    className="w-4 h-4 text-black focus:ring-black border-gray-300"
                  />
                  Principal
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. BOTONES DE ACCIÓN */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={selectedAreas.length === 0}
          className="flex-1 py-3 px-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-transform active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};