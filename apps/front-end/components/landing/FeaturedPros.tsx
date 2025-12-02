interface ProfessionalMock {
  id: number;
  name: string;
  profession: string;
  rating: number;
}

const FEATURED_PROS: ProfessionalMock[] = [
  { id: 1, name: "Carlos Gómez", profession: "Electricista Matriculado", rating: 5 },
  { id: 2, name: "Ana Martínez", profession: "Niñera / Cuidado Infantil", rating: 4.8 },
  { id: 3, name: "Roberto Díaz", profession: "Gasista", rating: 5 },
  { id: 4, name: "Laura Fernández", profession: "Empleada Doméstica", rating: 4.9 },
];

export function FeaturedPros() {
  return (
    <section className="py-8 container mx-auto px-4">
      <div className="border-2 border-gray-400 rounded-t-[3rem] pt-12 pb-16 px-6 bg-white">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Profesionales mejor valuados
          </h2>
          
          <div className="flex flex-wrap justify-evenly gap-10">
            {FEATURED_PROS.map((pro) => (
              <div key={pro.id} className="flex flex-col items-center space-y-3 w-48">
                
                {/* Avatar Circle */}
                <div className="w-32 h-32 rounded-full bg-gray-200 border-2 border-gray-400 flex items-center justify-center relative">
                   <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                   </svg>
                   
                   {/* Badge de estrella */}
                   <div className="absolute top-0 right-0 bg-white p-1 rounded-full border-2 border-gray-400 shadow-sm">
                      <span className="text-yellow-500 font-bold flex items-center text-sm px-1">
                        ★ {pro.rating}
                      </span>
                   </div>
                </div>
  
                {/* Información del Profesional */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {pro.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 font-medium">
                    {pro.profession}
                  </p>
                </div>
  
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}