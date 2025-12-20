"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

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

interface StatsProps {
  jobs: number;
  rating: number;
  isVerified: boolean;
}

export const DashboardStats = ({ jobs, rating, isVerified }: StatsProps) => {
  const displayJobs = isVerified ? jobs : 0;
  const displayRating = 5;

  const numberClass = isVerified ? "text-gray-900" : "text-gray-300";
  const starClass = isVerified ? "text-yellow-400" : "text-gray-300";
  const labelClass = isVerified ? "text-gray-500" : "text-gray-300";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Card Trabajos */}
      <div
        className={`rounded-3xl p-6 border flex flex-col items-center justify-center min-h-40 transition-colors ${isVerified ? "bg-gray-50 border-gray-100" : "bg-gray-50/50 border-gray-100"}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <h4 className={`${labelClass} font-medium`}>Trabajos Realizados</h4>
          {!isVerified && <Lock size={14} className="text-gray-300" />}
        </div>

        <span className={`text-6xl font-bold ${numberClass}`}>
          <AnimatedNumber value={displayJobs} />
        </span>

        <span className="text-xs text-gray-400 mt-2">
          {isVerified
            ? "Proyectos completados en la plataforma"
            : "Disponible al verificar"}
        </span>
      </div>

      {/* Card Valoración */}
      <div
        className={`rounded-3xl p-6 border flex flex-col items-center justify-center min-h-40 transition-colors ${isVerified ? "bg-gray-50 border-gray-100" : "bg-gray-50/50 border-gray-100"}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <h4 className={`${labelClass} font-medium`}>Tu Valoración Actual</h4>
          {!isVerified && <Lock size={14} className="text-gray-300" />}
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-5xl ${starClass}`}>★</span>
          <span className={`text-6xl font-bold ${numberClass}`}>
            <AnimatedNumber value={displayRating} isFloat={true} />
          </span>
        </div>

        <span className="text-xs text-gray-400 mt-2">
          {isVerified
            ? "Basado en reseñas de clientes"
            : "Disponible al verificar"}
        </span>
      </div>
    </div>
  );
};
