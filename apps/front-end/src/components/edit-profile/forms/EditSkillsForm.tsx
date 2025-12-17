"use client";

import React, { useState } from 'react';
import { UIField } from '@/types';
import { FieldSelector } from '@/src/components/professional-creation/FieldSelector';
import { Field } from '@tembiapo/db';

interface Props {
  initialFields: UIField[];
  availableOptions: Field[];
  onSave: (newFields: UIField[]) => void;
  onCancel: () => void;
}

export const EditSkillsForm = ({ initialFields, availableOptions, onSave, onCancel }: Props) => {
  // Estado local de los rubros seleccionados
  const [selectedFields, setSelectedFields] = useState<UIField[]>(initialFields);

  // --- LÓGICA DE SELECCIÓN ---

  const toggleField = (id: string) => {
    const exists = selectedFields.find((f) => f.id === id);
    if (exists) {
      removeField(id);
    } else {
      const isFirst = selectedFields.length === 0;
      
      const fieldData = availableOptions.find(f => f.id === id);
      
      if (fieldData) {
        const newField: UIField = {
            ...fieldData,
            isMain: isFirst
        };
        setSelectedFields([...selectedFields, newField]);
      }
    }
  };

  const removeField = (id: string) => {
    const newFields = selectedFields.filter((f) => f.id !== id);
    if (newFields.length > 0 && !newFields.some((f) => f.isMain)) {
      newFields[0].isMain = true;
    }
    setSelectedFields(newFields);
  };

  const setMainField = (id: string) => {
    setSelectedFields(
      selectedFields.map((f) => ({ ...f, isMain: f.id === id }))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFields.length === 0) {
      alert("Debes seleccionar al menos un rubro");
      return;
    }
    onSave(selectedFields);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* 1. SELECCIONADOR TIPO GRID */}
      <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona tus Rubros
          </label>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 max-h-[300px] overflow-y-auto">
          {/* Reutilizamos tu componente FieldSelector existente */}
          <FieldSelector
            fields={availableOptions} 
            selectedIds={selectedFields.map((f) => f.id)}
            onToggle={toggleField}
          />
        </div>
      </div>

      {/* 2. LISTA DE SELECCIONADOS (GESTIÓN DE PRINCIPAL) */}
      {selectedFields.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-semibold">
            Rubros seleccionados <span className="text-gray-400 font-normal">(Marca el principal)</span>
          </p>
          
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
            {selectedFields.map((sf) => (
              <div
                key={sf.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  sf.isMain
                    ? "bg-blue-50 border-blue-200"
                    : "bg-white border-gray-200 hover:border-blue-200"
                }`}
              >
                <span className="font-medium text-gray-800">
                  {sf.name}
                </span>
                
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900 select-none">
                  <input
                    type="radio"
                    checked={sf.isMain}
                    onChange={() => setMainField(sf.id)}
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
          disabled={selectedFields.length === 0}
          className="flex-1 py-3 px-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-transform active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};