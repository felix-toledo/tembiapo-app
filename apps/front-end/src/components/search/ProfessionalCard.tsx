import Image from "next/image";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/outline"; // Opcional, si quieres mostrar ciudad

interface ProfessionalCardProps {
  name: string;
  profession: string;
  rating: number;
  imageUrl?: string | null;
  isVerified?: boolean;
  isPremium?: boolean;
}

export function ProfessionalCard({
  name,
  profession,
  rating,
  imageUrl,
  isVerified = false,
  isPremium = false,
}: ProfessionalCardProps) {
  // Helper para iniciales si no hay foto
  const getInitials = (fullName: string) => {
    const names = fullName.split(" ");
    return `${names[0]?.[0] || ""}${names[1]?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="group h-full flex flex-col items-center bg-white border border-gray-100 rounded-4xl p-6 shadow-sm hover:shadow-xl hover:border-orange-100 transition-all duration-300 relative overflow-hidden">
      {/* Fondo decorativo sutil en hover */}
      <div className="absolute top-0 left-0 w-full h-20 bg-linear-to-b from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* --- AVATAR CONTAINER --- */}
      <div className="relative mb-5 z-10">
        {/* Anillo animado en hover */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-white border-2 border-gray-100 group-hover:border-[#E35205] transition-colors duration-300 shadow-sm relative">
          <div className="w-full h-full rounded-full relative overflow-hidden bg-gray-50">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`Foto de ${name}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 112px, 128px"
              />
            ) : (
              // Placeholder con Iniciales
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-3xl group-hover:text-gray-500 transition-colors">
                {getInitials(name)}
              </div>
            )}
          </div>

          {/* Badge de Verificación (Integrado en el avatar) */}
          {isVerified && !isPremium && (
            <div
              className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm"
              title="Profesional Verificado"
            >
              <CheckBadgeIcon className="h-6 w-6 text-blue-600" />
            </div>
          )}

          {/* Badge de Premium */}
          {isPremium && (
            <div
              className="absolute bottom-1 right-1 bg-white rounded-full p-0.5 shadow-sm"
              title="Profesional Premium"
            >
              <CheckBadgeIcon className="h-6 w-6 text-amber-400" />
            </div>
          )}
        </div>

        {/* Badge de Rating (Flotante) */}
        <div className="absolute -top-2 -right-2 bg-white border border-gray-100 shadow-md rounded-full px-3 py-1 flex items-center gap-1.5 transform group-hover:-translate-y-1 transition-transform duration-300">
          <span className="text-yellow-400 text-base">★</span>
          <span className="text-sm font-bold text-gray-900">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* --- INFO TEXT --- */}
      <div className="text-center w-full z-10 flex flex-col items-center grow">
        {/* Nombre */}
        <h3 className="text-gray-900 font-bold text-lg mb-1 truncate w-full px-2 group-hover:text-[#E35205] transition-colors">
          {name}
        </h3>

        {/* Profesión (Estilo Tag) */}
        <div className="inline-block px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-sm font-medium text-gray-600 mb-4 group-hover:bg-orange-50 group-hover:text-[#E35205] group-hover:border-orange-100 transition-all">
          {profession}
        </div>

        {/* Botón visual "Ver Perfil" (Opcional, pero ayuda al CTA) */}
        <div className="mt-auto pt-2 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="text-sm font-semibold text-gray-900 border-b-2 border-[#E35205]">
            Ver perfil completo
          </span>
        </div>
      </div>
    </div>
  );
}
