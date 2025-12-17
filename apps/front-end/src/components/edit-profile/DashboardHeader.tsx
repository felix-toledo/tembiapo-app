"use client";

import { EyeIcon } from 'lucide-react';
import Link from 'next/link';

interface Props {
  name: string;
  profession: string;
  username: string;
}

export const DashboardHeader = ({ name, profession, username }: Props) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      
      {/* Títulos */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
          {name}
        </h1>
        <p className="text-xl text-gray-500 font-medium uppercase tracking-wide">
          {profession}
        </p>
      </div>

      <Link 
        href={`/profile/${username}`}
        target="_blank"
        className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-black transition-all text-gray-700 hover:text-black"
      >
        <EyeIcon size={18} className="text-gray-400 group-hover:text-black transition-colors" />
        <span className="font-medium">Vista del perfil</span>
      </Link>
      
    </div>
  );
};