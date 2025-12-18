import { UserProfileData } from "@/types";
import { getFakeRating } from "@/src/lib/utils";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { PortfolioFormData } from "../edit-profile/forms/AddPortfolioForm";
import { useFetch } from "@/src/hooks/useFetch";
import { useEffect, useState } from "react";
import Image from "next/image";

// Asegúrate de que tu tipo UserProfileData tenga la propiedad isPremium
// interface UserProfileData { ...; isPremium?: boolean; ... }

interface Props {
  data: UserProfileData;
}

const AnimatedNumber = ({
  value,
  isFloat = false,
}: {
  value: number;
  isFloat?: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (value - startValue) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <span>{isFloat ? displayValue.toFixed(1) : Math.floor(displayValue)}</span>
  );
};

export const ProfileHeader = ({ data }: Props) => {
  const fullName = `${data.name} ${data.lastName}`;
  const profession = data.fields[0]?.name || "Profesional";

  // Lógica de visualización dinámica (Prioridad: Premium > Verified)
  const isPremium = data.isPremium;
  const isVerified = data.isVerified;

  // Rating: Si es premium o verificado tiene color, si no es gris
  const rating = (isVerified || isPremium) ? getFakeRating(data.professionalId) : 0.0;
  
  // Color de la estrella
  const ratingColor = isPremium 
    ? "text-amber-400"
    : isVerified 
      ? "text-yellow-400"
      : "text-gray-300";

  const ratingText = (isVerified || isPremium) ? "text-gray-900" : "text-gray-400";

  const { data: portfolioItems } = useFetch<PortfolioFormData[]>(
    data.username ? `/api/auth/portfolio/${data.username}` : ""
  );

  const jobsCount = portfolioItems ? portfolioItems.length : 0;

  const getInitials = (name: string, lastName: string) => {
    return `${name[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center mb-10 gap-6 sm:gap-0">
      
      {/* 1. Avatar con Badge Flotante */}
      <div className="sm:mr-8 shrink-0 relative group">
        {/* Contenedor circular de la imagen */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center relative overflow-hidden">
          {data.avatarURL ? (
            <Image
              src={data.avatarURL}
              alt={fullName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 128px, 160px"
            />
          ) : (
            <span className="text-4xl sm:text-5xl font-bold text-gray-500">
              {getInitials(data.name, data.lastName)}
            </span>
          )}
        </div>
        
        {/* Caso PREMIUM */}
        {isPremium && (
          <div
            className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md border border-gray-100 z-10"
            title="Profesional Premium"
          >
            <CheckBadgeIcon className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
          </div>
        )}

        {/* Caso VERIFICADO (Solo si NO es premium, para no encimar iconos) */}
        {isVerified && !isPremium && (
          <div
            className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md border border-gray-100 z-10"
            title="Profesional Verificado"
          >
            <CheckBadgeIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
        )}
      </div>

      {/* 2. Info Central */}
      <div className="text-center sm:text-left flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-2 mb-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight truncate">
            {fullName}
          </h1>

          {/* BADGE DE TEXTO DINÁMICO */}
          {isPremium ? (
             // --- BADGE PREMIUM ---
            <div className="flex items-center px-2 py-1 rounded-full bg-amber-50 border border-amber-200 shrink-0 select-none shadow-sm">
              <CheckBadgeIcon className="h-5 w-5 text-amber-500" />
              <span className="text-xs text-amber-700 ml-1 font-bold leading-none pt-px tracking-wide">
                PREMIUM
              </span>
            </div>
          ) : isVerified ? (
             // --- BADGE VERIFICADO ---
            <div className="flex items-center px-2 py-1 rounded-full bg-blue-50 border border-blue-100 shrink-0 select-none">
              <CheckBadgeIcon className="h-5 w-5 text-blue-600" />
              <span className="text-xs text-blue-700 ml-1 font-bold leading-none pt-px">
                VERIFICADO
              </span>
            </div>
          ) : (
             // --- BADGE NO VERIFICADO ---
            <div className="flex items-center px-2 py-1 rounded-full bg-gray-100 border border-gray-200 shrink-0 select-none">
              <span className="h-4 w-4 rounded-full bg-gray-300 text-white flex items-center justify-center text-[10px] font-bold">
                ✕
              </span>
              <span className="text-xs text-gray-500 ml-1 font-medium leading-none pt-px">
                No verificado
              </span>
            </div>
          )}
        </div>
        <p className="text-xl text-gray-600 font-medium">{profession}</p>
      </div>

      {/* 3. Stats (Valoración + Trabajos) */}
      <div className="mt-4 sm:mt-0 sm:ml-8 shrink-0 flex gap-4">
        {/* Caja de Rating */}
        <div className={`flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border min-w-[100px] transition-colors ${isPremium ? 'border-amber-100 bg-amber-50/30' : 'border-gray-100'}`}>
          <div className="flex items-center space-x-1">
            <span className={`text-3xl ${ratingColor}`}>★</span>
            <span className={`text-3xl font-bold leading-none ${ratingText}`}>
              <AnimatedNumber value={rating} isFloat={true} />
            </span>
          </div>
          <span className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">
            Valoración
          </span>
        </div>

        {/* Caja de Trabajos (Visible si es verificado O premium) */}
        {(isVerified || isPremium) && (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100 min-w-[100px]">
            <div className="flex items-center space-x-1">
              <span className="text-3xl font-bold leading-none text-gray-900">
                <AnimatedNumber value={jobsCount} />
              </span>
            </div>
            <span className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">
              Trabajos
            </span>
          </div>
        )}
      </div>
    </div>
  );
};