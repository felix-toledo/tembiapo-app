"use client";

import OurButton from '@/src/components/ui/OurButton'; // Reusamos tu botón 3D

export const VerificationBanner = () => {
  return (
    <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 mb-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400" />
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        ¡Tu perfil aún no está verificado!
      </h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Verifica tu identidad para acceder a todos los beneficios, aparecer primero en las búsquedas y generar más confianza.
      </p>
      
      <OurButton>
        Comenzar Verificación
      </OurButton>
    </div>
  );
};