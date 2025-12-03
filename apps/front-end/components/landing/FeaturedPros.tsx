import { ProfessionalCard } from "../search/ProfessionalCard";

interface ProfessionalMock {
  id: number;
  name: string;
  profession: string;
  rating: number;
}

const FEATURED_PROS: ProfessionalMock[] = [
  { id: 1, name: "Carlos Gómez", profession: "Electricista", rating: 5 },
  { id: 2, name: "Ana Martínez", profession: "Niñera / Cuidado Infantil", rating: 4.8 },
  { id: 3, name: "Roberto Díaz", profession: "Gasista", rating: 5 },
  { id: 4, name: "Laura Fernández", profession: "Empleada", rating: 4.9 },
];

export function FeaturedPros() {
  return (
    <section className="py-8 container mx-auto px-4">
      <div className="border-2 border-gray-400 rounded-t-[3rem] pt-12 pb-16 px-6 bg-white">
        {/* Grid de Resultados */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
              {FEATURED_PROS.map((pro) => (
                <ProfessionalCard 
                  key={pro.id}
                  name={pro.name}
                  profession={pro.profession}
                  rating={pro.rating}
                />
              ))}
            </div>
      </div>
    </section>
  );
}