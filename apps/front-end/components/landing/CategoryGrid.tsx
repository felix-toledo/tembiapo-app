import React from 'react';

// 1. DEFINICIÓN DEL TIPO
interface Field {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// 2. FUNCIÓN DE FETCHING
async function getFields(): Promise<Field[]> {
  const res = await fetch('http://localhost:3001/fields', { 
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Error al obtener los rubros');
  }

  return res.json();
}

// 3. COMPONENTE ASÍNCRONO
export async function CategoryGrid() {
  // Llamamos a la data
  const fields = await getFields();

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-2xl justify-self-center font-bold mb-6 text-gray-900">Rubros Disponibles</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {fields.map((field) => (
          <button
            key={field.id} 
            className="group flex items-center justify-center py-6 px-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-400 hover:-translate-y-1 transition-all duration-200"
          >
            <span className="text-lg font-medium text-gray-700 group-hover:text-black capitalize">
              {field.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}