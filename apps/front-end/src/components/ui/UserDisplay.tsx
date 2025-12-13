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

  function handleUserClick() {
    if (user.role.toUpperCase() === "ADMIN") {
      redirect("/admin/");
    } else if (!professional) {
      redirect("/create-professional");
    } else {
      redirect("/user/");
    }
  }
  // Get initials for fallback
  const getInitials = (name: string, lastName: string) => {
    return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div
      onClick={handleUserClick}
      className="flex items-center gap-3 mr-2 hover:cursor-pointer hover:shadow-sm hover:shadow-tierra-activa/40 p-2 rounded-md"
    >
      <div className="flex flex-col items-end">
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
            className="rounded-full object-cover border-2 border-tierra-activa shadow-sm"
          />
        ) : (
          <div className="h-full w-full rounded-full bg-linear-to-br from-parana-profundo to-blue-800 flex items-center justify-center text-white font-serif font-bold border-2 border-gray-100 shadow-sm">
            {getInitials(user.name, user.lastName)}
          </div>
        )}
      </div>
    </div>
  );
}
