import Link from 'next/link';
import { ProfessionalCardProps, PaginationData } from '@/types'; // Ajusta la ruta si es necesario
import { ServiceArea } from '@tembiapo/db';
import { ProfessionalCard } from '../../search/ProfessionalCard';
import { FilterBar } from '../../search/FilterBar';
import { Pagination } from '../../ui/Pagination';
import { SearchInput } from '../../search/SearchInput';
import LoaderSearch from '../../ui/loaders/LoaderSearch';
import { getFakeRating } from '../../../lib/utils';

interface FeaturedProsProps {
  title: string;
  professionals: ProfessionalCardProps[];
  pagination: PaginationData;
  areas: ServiceArea[];
  isLoading?: boolean;
}

export function FeaturedPros({ title, professionals, pagination, areas, isLoading }: FeaturedProsProps) {

  const getDisplayData = (pro: ProfessionalCardProps) => {
    const displayName = `${pro.name} ${pro.lastName}`;
    const displayProfession = pro.fields.find(f => f.isMain)?.name || pro.fields[0]?.name || "Profesional";
    const rating = getFakeRating(pro.professionalId);
    return { displayName, displayProfession, rating };
  };

  return (
    <section id="results" className="py-8 container mx-auto px-4 scroll-mt-24">

      {/* Estilo consistente: border-black y rounded-[3rem] */}
      <div className="border-2 border-black rounded-[3rem] pt-12 pb-16 px-6 sm:px-10 bg-white min-h-[600px] shadow-sm transition-all">

        {/* --- HEADER: Título y Buscador --- */}
        <div className="flex flex-col lg:flex-row justify-evenly items-end lg:items-center mb-8 gap-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center lg:text-left capitalize w-full lg:w-auto">
            {title}
          </h2>

          <div className="w-full lg:max-w-md">
            <SearchInput />
          </div>
        </div>

        {/* --- BARRA DE FILTROS --- */}
        <FilterBar areas={areas} />

        {/* --- CONTENIDO --- */}
        {isLoading ? (
          // ESTADO DE CARGA (LOADER)
          <div className="w-full h-[400px] flex flex-col items-center justify-center gap-4 animate-pulse">
            <div className="scale-75 sm:scale-100"> 
              <LoaderSearch />
            </div>
            <p className="text-gray-400 font-medium text-lg uppercase tracking-widest">
              Buscando los mejores...
            </p>
          </div>
        ) : (
          // ESTADO DE RESULTADOS
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center mt-8">
              {professionals.length > 0 ? (
                professionals.map((pro) => {
                  const { displayName, displayProfession, rating } = getDisplayData(pro);

                  return (
                    // NAVEGACIÓN: Envolvemos la tarjeta en un Link al perfil
                    <Link 
                      key={pro.professionalId} 
                      href={`/profile/${pro.username}`}
                      className="contents" // 'contents' hace que el Link no afecte el Grid layout
                    >
                      <ProfessionalCard
                        name={displayName}
                        profession={displayProfession}
                        rating={rating}
                        imageUrl={pro.avatarURL} 
                        isVerified={pro.isVerified}
                      />
                    </Link>
                  )
                })
              ) : (
                // EMPTY STATE
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-gray-500">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900">No encontramos profesionales</p>
                  <p className="text-sm">Intenta ajustar los filtros o buscar con otro nombre.</p>
                </div>
              )}
            </div>

            {/* PAGINACIÓN */}
            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}