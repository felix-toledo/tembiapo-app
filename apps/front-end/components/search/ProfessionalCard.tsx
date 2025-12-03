import { CheckBadgeIcon } from '@heroicons/react/24/solid';

interface ProfessionalCardProps {
  name: string;
  profession: string;
  rating: number;
  imageUrl?: string;
}

export function ProfessionalCard({ name, profession, rating }: ProfessionalCardProps) {
  return (
    <div className="flex flex-col items-center p-4">
      {/* Avatar Container */}
      <div className="relative mb-3">
        {/* Círculo Gris (Avatar) */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-300 flex items-center justify-center border-2 border-transparent">
            {/* Icono Placeholder */}
            <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
        </div>

        {/* Estrella de Rating (Esquina superior derecha) */}
        <div className="absolute top-0 right-0 bg-white border border-gray-200 shadow-sm rounded-full px-1.5 py-0.5 flex items-center gap-1">
          <span className="text-yellow-500 text-sm">★</span>
          <span className="text-xs font-bold text-gray-900">{rating}</span>
        </div>
      </div>

      {/* Info Text */}
      <div className="text-center w-full">
        <div className="flex items-center justify-center gap-1">
            <h3 className="text-sm sm:text-base text-gray-600 font-medium">{name}</h3>
            {/* Icono de Verificado (Azul) */}
            <CheckBadgeIcon className="h-4 w-4 text-blue-600" title="Verificado" />
        </div>
        <p className="text-lg sm:text-xl font-bold text-gray-900 capitalize mt-1">
          {profession}
        </p>
      </div>
    </div>
  );
}