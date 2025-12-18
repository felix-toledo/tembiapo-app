"use client";

import React from "react";
import Image from "next/image";
import { UserIcon, PencilIcon, Phone } from "lucide-react";

// --- COMPONENTE AUXILIAR ---
const EditButton = ({
  onClick,
  label,
}: {
  onClick?: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className="mt-3 bg-black text-white px-6 py-1.5 rounded-full text-xs font-medium hover:bg-gray-800 transition-transform active:scale-95 flex items-center gap-2 mx-auto"
  >
    <PencilIcon size={12} />
    {label}
  </button>
);

// --- COMPONENTE PRINCIPAL ---
interface Props {
  avatarUrl?: string | null;
  description: string;
  skills: string[];
  cities: string[];
  phone?: string; // Prop del teléfono
  onEditDescription?: () => void;
  onEditSkills?: () => void;
  onEditCities?: () => void;
  onEditPhone?: () => void;
  onAvatarChange?: (file: File) => void;
}

export const EditProfileSidebar = ({
  avatarUrl,
  description,
  skills,
  cities,
  phone,
  onEditDescription,
  onEditSkills,
  onEditCities,
  onEditPhone,
  onAvatarChange,
}: Props) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onAvatarChange) {
      onAvatarChange(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] px-8 py-8 border border-gray-100 shadow-sm flex flex-col gap-8 text-center w-full">
      
      {/* 1. SECCIÓN AVATAR Y CONTACTO */}
      <div className="flex flex-col items-center">
        {/* Círculo de la foto */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-40 h-40 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center relative overflow-hidden group cursor-pointer transition-transform hover:scale-105"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 160px, 160px"
            />
          ) : (
            <UserIcon size={64} className="text-gray-400" />
          )}
          {/* Overlay hover */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <PencilIcon className="text-white" />
          </div>
        </div>

        {/* Link texto editar foto */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-3 text-blue-600 text-xs font-bold hover:underline mb-4"
        >
          CAMBIAR FOTO
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* --- NUEVO CAMPO DE TELÉFONO (Estilo Badge) --- */}
        <div 
          onClick={onEditPhone}
          className="group cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm w-full max-w-[200px] justify-center"
          title="Editar número de WhatsApp"
        >
          <Phone size={16} className={`transition-colors ${phone ? 'text-green-600' : 'text-gray-400'}`} />
          
          <span className={`text-sm font-medium truncate ${phone ? 'text-gray-800' : 'text-gray-400 italic'}`}>
            {phone || "Agrega tu WhatsApp"}
          </span>
          
          {/* Icono de lápiz que aparece al pasar el mouse */}
          <PencilIcon size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
        </div>

      </div>

      <hr className="border-gray-100 w-full" />

      {/* 2. SECCIÓN DESCRIPCIÓN */}
      <div>
        <h3 className="text-gray-900 font-bold mb-3 text-lg">Descripción</h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-6 px-2 whitespace-pre-line">
          {description ||
            "Agrega una descripción para que los clientes te conozcan mejor."}
        </p>
        <EditButton label="Editar" onClick={onEditDescription} />
      </div>

      {/* 3. SECCIÓN HABILIDADES */}
      <div>
        <h3 className="text-gray-900 font-bold mb-3 text-lg">
          Habilidades
        </h3>
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm italic">
              Sin habilidades
            </span>
          )}
        </div>
        <EditButton label="Editar" onClick={onEditSkills} />
      </div>

      {/* 4. SECCIÓN CIUDADES */}
      <div>
        <h3 className="text-gray-900 font-bold mb-3 text-lg">Ciudades</h3>
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {cities.length > 0 ? (
            cities.map((city, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium"
              >
                {city}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm italic">
              Sin ciudades
            </span>
          )}
        </div>
        <EditButton label="Editar" onClick={onEditCities} />
      </div>

    </div>
  );
};