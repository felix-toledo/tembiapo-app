import { FeaturedPros } from "./FeaturedPros";

export function FeaturedProsSkeleton() {
  // Renderizamos el componente visual forzando el modo carga
  return (
    <FeaturedPros
      title="Buscando..."
      professionals={[]} 
      areas={[]}
      pagination={{ page: 1, totalPages: 1, limit: 8, total: 0 }}
      isLoading={true} // <--- LA CLAVE
    />
  );
}