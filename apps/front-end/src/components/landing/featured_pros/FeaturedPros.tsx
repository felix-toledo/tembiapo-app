import { Professional, PaginationData } from '../../../../types';
import { ServiceArea } from '@tembiapo/db';
import { ProfessionalCard } from '../../search/ProfessionalCard';
import { FilterBar } from '../../search/FilterBar';
import { Pagination } from '../../ui/Pagination';
import { SearchInput } from '../../search/SearchInput';
import LoaderSearch from '../../ui/loaders/LoaderSearch';

interface FeaturedProsProps {
  title: string;
  professionals: Professional[];
  pagination: PaginationData;
  areas: ServiceArea[];
  isLoading?: boolean;
}

// Función para generar una valoración "fake" basada en el ID del profesional
function getFakeRating(id: string): number {
  const charCodeSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ((charCodeSum % 11) + 40) / 10;
}

export function FeaturedPros({ title, professionals, pagination, areas, isLoading }: FeaturedProsProps) {

  // --- ADAPTADOR DE DATOS (Frontend Logic) ---
  // Transforma el objeto complejo de la API en lo que la Card necesita visualmente.
  const getDisplayData = (pro: Professional) => {
    // 1. Unir Nombre y Apellido
    const displayName = `${pro.name} ${pro.lastName}`;

    // 2. Elegir el rubro principal o el primero disponible
    const displayProfession = pro.fields.find(f => f.isMain)?.name || pro.fields[0]?.name || "Profesional";

    // 3. Obtener el rating calculado
    const rating = getFakeRating(pro.professionalId);

    return { displayName, displayProfession, rating };
  };

  return (
    // ID="results"
    <section id="results" className="py-8 container mx-auto px-4 scroll-mt-24">

      {/* Contenedor estilo "Card Gigante" con borde negro (Neo-Brutalism) */}
      <div className="border-2 border-gray-400 rounded-[3rem] pt-12 pb-16 px-6 sm:px-10 bg-white min-h-[600px] shadow-sm">

        {/* --- HEADER: Título y Buscador --- */}
        <div className="flex flex-col justify-between items-end lg:items-center mb-8 gap-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center lg:text-left capitalize w-full lg:w-auto">
            {title}
          </h2>

          {/* Input de búsqueda por nombre */}
          <div className="w-full lg:max-w-md">
            <SearchInput />
          </div>
        </div>

        {/* --- BARRA DE FILTROS --- */}
        <FilterBar areas={areas} />

        {/* --- AQUÍ ESTÁ LA LÓGICA DEL LOADER --- */}
        {isLoading ? (
          <div className="w-full h-[400px] flex flex-col items-center justify-center gap-4 animate-pulse">

            {/* Aquí ponemos tu LoaderSearch */}
            <div className="scale-75 sm:scale-100"> {/* Ajuste de escala para móviles si es muy grande */}
              <LoaderSearch />
            </div>

            <p className="text-gray-400 font-medium text-lg uppercase tracking-widest">
              Buscando los mejores...
            </p>
          </div>
        ) : (
          <>
            {/* --- GRILLA DE RESULTADOS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center mt-8">
              {professionals.length > 0 ? (
                professionals.map((pro) => {
                  const { displayName, displayProfession, rating } = getDisplayData(pro);

                  return (
                    <ProfessionalCard
                      key={pro.professionalId}
                      name={displayName}
                      profession={displayProfession}
                      rating={rating}
                    // imageUrl={pro.avatarURL} // Descomentar cuando tengas imágenes reales
                    />
                  )
                })
              ) : (
                // --- EMPTY STATE (Cuando no hay resultados) ---
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-gray-500">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-900">No encontramos profesionales</p>
                  <p className="text-sm">Intenta ajustar los filtros o buscar con otro nombre.</p>
                </div>
              )}
            </div>

            {/* --- PAGINACIÓN --- */}
            {/* Solo la mostramos si hay más de 1 página */}
            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} />
              </div>
            )}
          </>)}
      </div>
    </section>
  );
}