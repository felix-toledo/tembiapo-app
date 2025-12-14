import React from 'react';
import { UserProfileData } from '@/types';
import { MapPinIcon } from '@heroicons/react/24/solid'; 
import { Field } from '@tembiapo/db';

interface Props {
  data: UserProfileData;
}

export const ProfileInfo = ({ data }: Props) => {
  // Construimos el string de ubicación basado en el array 'area'
  const mainArea = data.area.find(a => a.isMain) || data.area[0];
  const locationString = mainArea 
    ? `${mainArea.city}, ${mainArea.province}, ${mainArea.country}`
    : "Ubicación no especificada";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-200 pt-8">
      {/* Columna Izquierda: Descripción */}
      <div className="md:col-span-2">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {data.description || "Este profesional no ha añadido una descripción."}
        </p>
      </div>

      {/* Columna Derecha: Ubicación y Skills */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ubicación</h2>
          <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl inline-flex pr-4">
             <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
            <span className="font-medium text-sm">{locationString}</span>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Habilidades Principales</h2>
          <div className="flex flex-wrap gap-2">
            {data.fields.map((field: Field) => (
              <span key={field.id} className="bg-white border border-blue-200 text-blue-800 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm">
                {field.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};