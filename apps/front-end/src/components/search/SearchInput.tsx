'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/react/24/outline'; // Agregué ArrowRight para el botón
import { AutoScroll } from '@/src/lib/utils';

export function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentQ = searchParams.get('q') || '';

    const [searchTerm, setSearchTerm] = useState(currentQ);

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        if (term.trim()) params.set('q', term);
        else params.delete('q');
        router.push(`/?${params.toString()}#results`, { scroll: false });

        AutoScroll('results');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch(searchTerm);
    };

    return (
        <div className="relative w-full group">
            {/* Input Principal */}
            <input
                key={currentQ}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar por nombre..."
                className="                   
                    w-full pl-12 pr-14 py-4 
                    bg-white border border-gray-200 rounded-full 
                    text-gray-900 font-medium placeholder:text-gray-400
                    shadow-sm transition-all duration-300 ease-in-out
                    outline-none
                    focus:border-[#E35205] focus:ring-4 focus:ring-[#E35205]/10 focus:shadow-md
                    group-hover:border-gray-300
                "
            />
            
            {/* Icono Izquierdo (Decorativo) */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#E35205] transition-colors">
                <MagnifyingGlassIcon className="h-6 w-6" />
            </div>

            {/* Botón Derecho (Acción) */}
            <button
                onClick={() => handleSearch(searchTerm)}
                className="
                    absolute right-2 top-1/2 transform -translate-y-1/2 
                    p-2.5 rounded-full 
                    bg-[#E35205] text-white 
                    shadow-md hover:shadow-lg hover:bg-[#d14900] hover:scale-105
                    active:scale-95
                    transition-all duration-200
                "
                aria-label="Buscar"
            >
                {/* Cambié la lupa por una flecha para indicar "Ir", pero puedes dejar la lupa si prefieres */}
                <ArrowRightIcon className="h-5 w-5 stroke-[2.5]" /> 
            </button>
        </div>
    );
}