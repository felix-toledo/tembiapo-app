"use client";

import React, { useState } from 'react';

interface Props {
  initialDescription: string;
  onSave: (newDescription: string) => void;
  onCancel: () => void;
}

export const EditDescriptionForm = ({ initialDescription, onSave, onCancel }: Props) => {
  const [description, setDescription] = useState(initialDescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(description);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Sobre mí
        </label>
        <textarea
          id="description"
          rows={6}
          className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none text-gray-700 bg-gray-50"
          placeholder="Cuenta tu experiencia, especialidades y por qué deberían contratarte..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="text-xs text-gray-400 text-right">
          {description.length} caracteres
        </p>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 py-3 px-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-transform active:scale-95 shadow-lg"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};