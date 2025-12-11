import { FeaturedPros } from "./FeaturedPros";
import { fetchProfessionals, getSectionTitle } from "@/src/services/landing.service";
import { ServiceArea, Field } from "@tembiapo/db";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
  areas: ServiceArea[];
  fields: Field[];
}

export async function FeaturedProsContainer({ searchParams, areas, fields }: Props) {
  // B. Fetch solo de profesionales
  const data = await fetchProfessionals(searchParams);
  
  const professionals = data?.professionals || [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, limit: 8, total: 0 };
  
  // C. Calculamos el título
  const title = getSectionTitle(searchParams, fields);

  return (
    <FeaturedPros
      title={title}
      professionals={professionals}
      pagination={pagination}
      areas={areas}
      isLoading={false}
    />
  );
}