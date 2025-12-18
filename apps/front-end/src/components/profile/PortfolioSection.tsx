import { useState } from 'react';
import Image from 'next/image';
import { PortfolioItem } from '@/types';
import { PortfolioDetailModal } from './PortfolioDetailModal';

interface Props {
  items: PortfolioItem[];
  isLoading?: boolean;
}

export const PortfolioSection = ({ items, isLoading }: Props) => {
  
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  if (isLoading) {
    return (
      <div className="mt-12 border-t border-gray-200 pt-10 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
             <div key={i} className="aspect-4/3 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <>
      <div className="mt-12 border-t border-gray-200 pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Portafolio</h2>
          <span className="text-sm text-gray-500">{items.length} Proyectos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const coverImage = item.images && item.images.length > 0 ? item.images[0].imageUrl : null;

            return (
              <div 
                key={item.id} 
                onClick={() => setSelectedItem(item)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                {/* Imagen */}
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                  {coverImage ? (
                    <Image 
                      src={coverImage} 
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">Sin Imagen</div>
                  )}
                  {/* Overlay sutil al hacer hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                
                {/* Contenido Texto */}
                <div className="p-4">
                  {item.field && (
                    <div className="text-[#E35205] text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
                      {item.field.name}
                    </div>
                  )}

                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Renderizamos el Modal */}
      <PortfolioDetailModal 
        key={selectedItem?.id || 'modal-closed'} 
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
      />
    </>
  );
};