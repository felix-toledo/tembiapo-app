'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch(searchTerm);
    };

    return (
        <div className="relative w-full">
            <input
                key={currentQ}

                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar por nombre..."
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-400 rounded-lg 
                   text-gray-900 placeholder:text-gray-500 font-medium
                   focus:outline-none focus:ring-2 focus:ring-gray-400 
                   bg-white shadow-sm transition-all"
            />
            {/* ... iconos y botones ... */}
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <button
                onClick={() => handleSearch(searchTerm)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-800 text-white rounded-md"
            >
                <MagnifyingGlassIcon className="h-4 w-4" />
            </button>
        </div>
    );
}