"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  BicepsFlexed,
  LogOut,
  Menu,
  MapPinHouse,
} from "lucide-react";
import { useState } from "react";

export function SideBar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fake user data for now
  const user = {
    name: "Admin User",
    role: "Administrator",
    avatar: "https://github.com/shadcn.png", // Placeholder
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Usuarios",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Profesionales",
      href: "/admin/professionals",
      icon: BicepsFlexed,
    },
    {
      name: "Áreas",
      href: "/admin/service-areas",
      icon: MapPinHouse,
    },
    {
      name: "Rubros",
      href: "/admin/fields",
      icon: Briefcase,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-parana-profundo text-blanco-puro rounded-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Container */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-blanco-puro border-r border-parana-profundo/10 shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col justify-between
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Top Section: Logo */}
        <div className="p-6 flex flex-col items-center justify-center border-b border-parana-profundo/10">
          <div className="relative w-12 h-12 mb-2">
            <Image
              src="/isotipo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-parana-profundo font-bold text-lg tracking-wide">
            TEMBIAPÓ
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-parana-profundo text-blanco-puro shadow-md"
                      : "text-gris-oscuro hover:bg-parana-profundo/10 hover:text-parana-profundo"
                  }
                `}
              >
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-blanco-puro"
                      : "text-gris-oscuro group-hover:text-parana-profundo"
                  }
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: User Profile */}
        <div className="p-4 border-t border-parana-profundo/10 relative group">
          {/* Hover Menu */}
          <div className="absolute bottom-full left-0 w-full p-2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <Link
                href="/admin/settings"
                className="flex items-center gap-2 px-4 py-3 text-sm text-gris-oscuro hover:bg-gray-50 transition-colors"
              >
                <Settings size={16} />
                Configuración
              </Link>
              <button className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
                <LogOut size={16} />
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Profile Card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200">
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-parana-profundo truncate">
                {user.name}
              </span>
              <span className="text-xs text-gris-oscuro/70 truncate">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden glass"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
