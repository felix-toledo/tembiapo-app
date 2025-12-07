'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    // 1. Copiamos los parámetros actuales (filtros, etc.)
    const params = new URLSearchParams(searchParams.toString());
    
    // 2. Actualizamos solo la página
    params.set('page', newPage.toString());

    // 3. Navegamos
    router.push(`/search?${params.toString()}`);
  };

  if (totalPages <= 1) return null; // No mostrar si hay una sola página

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <span className="text-sm font-medium text-gray-700">
        Página {currentPage} de {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="p-2 border border-black text-white bg-black rounded-full hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}