"use client";

import Link from "next/link";
import { ProfessionalCardProps, PaginationData } from "@/types";
import { ServiceArea } from "@tembiapo/db";
import { ProfessionalCard } from "../../search/ProfessionalCard";
import { FilterBar } from "../../search/FilterBar";
import { Pagination } from "../../ui/Pagination";
import { SearchInput } from "../../search/SearchInput";
import LoaderSearch from "../../ui/loaders/LoaderSearch";
import { getFakeRating } from "../../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, SearchX } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface FeaturedProsProps {
  title: string;
  professionals: ProfessionalCardProps[];
  pagination: PaginationData;
  areas: ServiceArea[];
  isLoading?: boolean;
}

export function FeaturedPros({
  title,
  professionals,
  pagination,
  areas,
  isLoading,
}: FeaturedProsProps) {
  const getDisplayData = (pro: ProfessionalCardProps) => {
    const displayName = `${pro.name} ${pro.lastName}`;
    const displayProfession =
      pro.fields.find((f) => f.isMain)?.name ||
      pro.fields[0]?.name ||
      "Profesional";
    const rating = getFakeRating(pro.professionalId);
    return { displayName, displayProfession, rating };
  };

  const router = useRouter();
  const pathname = usePathname();

  const handleClearFilters = () => {
    router.push(`${pathname}#results`, { scroll: false });
  };

  // Variantes de animación para la lista
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Efecto cascada entre tarjetas
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 50 },
    },
  };

  return (
    <section id="results" className="py-12 container mx-auto px-4 scroll-mt-24">
      {/* Contenedor Principal con estilo elevado */}
      <div className="bg-white border border-gray-100 rounded-[3rem] shadow-2xl shadow-gray-100/50 min-h-[600px] overflow-hidden relative">
        {/* Decoración de fondo sutil */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative pt-12 pb-16 px-6 sm:px-12">
          {/* --- HEADER --- */}
          <div className="flex flex-col xl:flex-row justify-between items-end xl:items-center mb-10 gap-8">
            {/* Título con diseño mejorado */}
            <div className="w-full xl:w-auto text-center xl:text-left">
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide">
                <Sparkles size={14} />
                <span>Talento Destacado</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight capitalize">
                {title}
                <span className="text-[#E35205]">.</span>
              </h2>
            </div>

            {/* Buscador */}
            <div className="w-full xl:max-w-md">
              <SearchInput />
            </div>
          </div>

          {/* --- BARRA DE FILTROS --- */}
          <div className="mb-12">
            <FilterBar areas={areas} />
          </div>

          {/* --- CONTENIDO --- */}
          <div className="min-h-[400px]">
            {isLoading ? (
              // ESTADO DE CARGA
              <div className="flex flex-col items-center justify-center h-[400px] gap-6 animate-pulse">
                <div className="scale-90 sm:scale-100 bg-gray-50 p-8 rounded-full">
                  <LoaderSearch />
                </div>
                <div className="text-center">
                  <p className="text-gray-900 font-bold text-xl mb-1">
                    Buscando talento...
                  </p>
                  <p className="text-gray-400 text-sm">
                    Estamos encontrando a los mejores para vos.
                  </p>
                </div>
              </div>
            ) : (
              // ESTADO DE RESULTADOS
              <AnimatePresence mode="wait">
                {professionals.length > 0 ? (
                  <>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8 justify-items-center"
                    >
                      {professionals.map((pro) => {
                        const { displayName, displayProfession, rating } =
                          getDisplayData(pro);

                        return (
                          <motion.div
                            key={pro.professionalId}
                            variants={itemVariants}
                            layout // Animación suave al cambiar de posición (filtrado)
                            className="w-full h-full"
                          >
                            <Link
                              href={`/profile/${pro.username}`}
                              className="block h-full transition-transform hover:-translate-y-1 duration-300"
                            >
                              <ProfessionalCard
                                name={displayName}
                                profession={displayProfession}
                                rating={rating}
                                imageUrl={pro.avatarURL}
                                isVerified={pro.isVerified}
                              />
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    {/* PAGINACIÓN */}
                    {pagination.totalPages > 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 border-t border-gray-100 pt-8"
                      >
                        <Pagination
                          currentPage={pagination.page}
                          totalPages={pagination.totalPages}
                        />
                      </motion.div>
                    )}
                  </>
                ) : (
                  // EMPTY STATE (Mejorado)
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="col-span-full py-24 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                      <SearchX className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      No encontramos profesionales
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      No hay resultados para esta búsqueda. Intenta cambiar los
                      filtros, la ubicación o buscar algo más general.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="text-[#E35205] font-semibold hover:underline cursor-pointer"
                    >
                      Limpiar todos los filtros
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
