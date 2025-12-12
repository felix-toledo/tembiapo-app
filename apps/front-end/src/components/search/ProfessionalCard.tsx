import Image from 'next/image';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

// Definimos las props locales (o podrías importarlas de tus types globales)
interface ProfessionalCardProps {
  name: string;
  profession: string;
  rating: number;
  imageUrl?: string | null;
  isVerified?: boolean; 
}

export function ProfessionalCard({ 
  name, 
  profession, 
  rating, 
  imageUrl, 
  isVerified = false 
}: ProfessionalCardProps) {
  return (
    <div className="flex flex-col items-center p-4 transition-transform hover:-translate-y-1 duration-200">
      
      {/* Avatar Container */}
      <div className="relative mb-3">
        
        {/* Círculo del Avatar */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-transparent relative overflow-hidden shadow-sm">
            
            {imageUrl ? (
              // CASO A: Tenemos foto
              <Image 
                src={imageUrl} 
                alt={`Foto de ${name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 96px, 128px"
              />
            ) : (
              // CASO B: No tenemos foto (Placeholder)
              <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            )}

        </div>

        {/* Estrella de Rating (Esquina superior derecha) */}
        <div className="absolute top-0 right-0 bg-white border border-gray-200 shadow-md rounded-full px-2 py-0.5 flex items-center gap-1 z-10">
          <span className="text-yellow-500 text-sm">★</span>
          <span className="text-xs font-bold text-gray-900">{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Info Text */}
      <div className="text-center w-full">
        <div className="flex items-center justify-center gap-1">
            <h3 className="text-sm sm:text-base text-gray-700 font-medium truncate max-w-[150px]">
              {name}
            </h3>
            
            {/* LÓGICA DE VERIFICADO: Solo se muestra si es true */}
            {isVerified && (
              <CheckBadgeIcon className="h-4 w-4 text-blue-600 shrink-0" title="Identidad Verificada" />
            )}
        </div>
        
        <p className="text-lg sm:text-xl font-bold text-gray-900 capitalize mt-1 leading-tight">
          {profession}
        </p>
      </div>
    </div>
  );
}