import { Navbar } from "../../src/components/landing/Navbar";
import { FilterBar } from "../../src/components/search/FilterBar";
import { ProfessionalCard } from "../../src/components/search/ProfessionalCard";
import { Pagination } from "../../src/components/ui/Pagination";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Professional,
  Field,
  ServiceArea,
  ApiSuccessResponse,
  PaginationData,
} from "../../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// --- HELPER PARA HARDCODEAR RATING (MVP) ---
// Genera un número "falso" pero consistente basado en el ID
function getFakeRating(id: string): number {
  // Sumamos los códigos ASCII de los caracteres del ID
  const charCodeSum = id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Fórmula mágica: (Resto de la división % 11) + 40 -> Nos da un número entre 40 y 50
  // Luego dividimos por 10 para tener un decimal (4.0 a 5.0)
  const rating = ((charCodeSum % 11) + 40) / 10;

  return rating;
}
// 1. Fetch de Profesionales con filtros
async function getProfessionals(filters: {
  [key: string]: string | string[] | undefined;
}) {
  const params = new URLSearchParams();

  const page = typeof filters.page === "string" ? filters.page : "1";
  params.append("page", page);
  params.append("limit", "8");

  if (typeof filters.field === "string") params.append("field", filters.field);
  if (typeof filters.area === "string") params.append("area", filters.area);
  if (typeof filters.isVerified === "string")
    params.append("isVerified", filters.isVerified);
  if (typeof filters.q === "string") params.append("username", filters.q);

  try {
    const res = await fetch(
      `${API_URL}/profile/all-professionals?${params.toString()}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;

    // Asegúrate de que esta línea también tenga el tipo correcto
    const json: ApiSuccessResponse<{
      professionals: Professional[];
      pagination: PaginationData;
    }> = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching professionals:", error);
    return null;
  }
}

// 2. Fetch de Rubros
async function getFields(): Promise<Field[]> {
  try {
    const res = await fetch(`${API_URL}/fields`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching fields:", error);
    return [];
  }
}

// 3. Fetch de Áreas de Servicio
async function getServiceAreas(): Promise<ServiceArea[]> {
  try {
    const res = await fetch(`${API_URL}/service-areas`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching areas:", error);
    return [];
  }
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SearchPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const [professionalsData, fieldsData, areasData] = await Promise.all([
    getProfessionals(searchParams),
    getFields(),
    getServiceAreas(),
  ]);

  const professionals = professionalsData?.professionals || [];
  const pagination = professionalsData?.pagination || {
    page: 1,
    totalPages: 1,
    limit: 10,
    total: 0,
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Header Buscador */}
      <div className="container mx-auto px-4 py-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="¿A quién estás buscando?"
            className="w-full pl-10 pr-4 py-3 border border-gray-400 rounded-lg 
                       text-gray-900 placeholder:text-gray-500 font-medium
                       focus:ring-2 focus:ring-black focus:border-transparent 
                       outline-none shadow-sm transition-all bg-white"
          />
          <MagnifyingGlassIcon className="h-6 w-6 text-black absolute left-4 top-1/2 transform -translate-y-1/2 font-bold pr-10" />
        </div>
      </div>

      <div className="grow container mx-auto px-4 pb-8">
        <div className="border-2 border-gray-400 rounded-[3rem] p-8 sm:p-12 min-h-[600px] relative">
          <FilterBar fields={fieldsData} areas={areasData} />

          {professionals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
              {professionals.map((pro: Professional) => {
                // Lógica de presentación
                const mainField =
                  pro.fields.find((f) => f.isMain)?.name ||
                  pro.fields[0]?.name ||
                  "Sin rubro";

                // AQUÍ USAMOS EL HELPER PARA EL HARDCODE INTELIGENTE
                const fakeRating = getFakeRating(pro.professionalId);

                return (
                  <ProfessionalCard
                    key={pro.professionalId}
                    name={`${pro.name} ${pro.lastName}`}
                    profession={mainField}
                    rating={fakeRating} // Pasamos el valor generado
                    // imageUrl={pro.avatarURL}
                  />
                );
              })}
            </div>
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500 font-medium">
              No encontramos profesionales con esos filtros.
            </div>
          )}

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
          />
        </div>
      </div>
    </main>
  );
}
