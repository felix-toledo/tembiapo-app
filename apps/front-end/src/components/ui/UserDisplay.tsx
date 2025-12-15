"use client";

import Image from "next/image";
import { User } from "@/src/context/AuthContext";
import { redirect } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

interface UserDisplayProps {
  user: User;
}

export default function UserDisplay({ user }: UserDisplayProps) {
  const { professional } = useAuth();
  const isPendingProfessional =
    user.role.toUpperCase() === "PROFESSIONAL" && !professional;

  function handleUserClick() {
    if (user.role.toUpperCase() === "ADMIN") {
      redirect("/admin/");
    } else if (isPendingProfessional) {
      redirect("/create-professional");
    } else {
      redirect(`/profile/${user.username}`);
    }
  }
  // Get initials for fallback
  const getInitials = (name: string, lastName: string) => {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="relative group/user-display">
      <div
        onClick={handleUserClick}
        className={`flex items-center gap-3 mr-2 hover:cursor-pointer p-2 rounded-md transition-all duration-200 
          ${isPendingProfessional ? "hover:bg-orange-50" : "hover:bg-gray-50 hover:shadow-tierra-activa/10"}
        `}
      >
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-bold text-parana-profundo leading-tight">
            {user.name} {user.lastName}
          </span>
          {user.username && (
            <span className="text-xs text-gray-500 font-medium">
              @{user.username}
            </span>
          )}
        </div>

        <div className="relative h-10 w-10 shrink-0">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={`${user.name} avatar`}
              fill
              className={`rounded-full object-cover shadow-sm transition-all duration-300
                ${isPendingProfessional ? "border-2 border-dashed border-tierra-activa" : "border-2 border-tierra-activa"}
              `}
            />
          ) : (
            <div
              className={`h-full w-full rounded-full flex items-center justify-center text-white font-serif font-bold shadow-sm transition-all duration-300
              ${
                isPendingProfessional
                  ? "bg-red-400/50 border-2 border-dashed border-tierra-activa text-tierra-activa"
                  : "bg-linear-to-br from-parana-profundo to-blue-800 border-2 border-gray-100"
              }
              `}
            >
              {getInitials(user.name, user.lastName)}
            </div>
          )}

          {/* Notification Badge */}
          {isPendingProfessional && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-tierra-activa rounded-full border-2 border-white flex items-center justify-center animate-pulse">
              <span className="sr-only">Completar perfil</span>
              <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip for pending profile */}
      {isPendingProfessional && (
        <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white rounded-lg shadow-xl border border-orange-100 opacity-0 invisible group-hover/user-display:opacity-100 group-hover/user-display:visible transition-all duration-200 z-50 transform translate-y-2 group-hover/user-display:translate-y-0">
          <div className="absolute -top-2 right-6 w-4 h-4 bg-white transform rotate-45 border-t border-l border-orange-100"></div>
          <div className="relative z-10">
            <h4 className="text-sm font-bold text-parana-profundo mb-1">
              ¡Falta poco! 🚀
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Completá tu perfil profesional para que los clientes puedan
              encontrarte en las búsquedas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
