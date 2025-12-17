"use client";

import { useEffect, useState } from "react";
import LoaderWaiterMini from "@/src/components/ui/loaders/LoaderWaiterMini";

interface Field {
  id: string;
  name: string;
  createdAt: string;
  _count?: {
    professionals: number;
  };
}

export default function Fields() {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFields();
  }, []);

  async function fetchFields() {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/api/v1/fields`);
      const data = await res.json();
      
      if (data.success && data.data) {
        setFields(data.data);
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredFields = fields.filter((field) =>
    field.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <LoaderWaiterMini />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rubros</h1>
          <p className="text-gray-700 mt-2">Gestión de rubros profesionales</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Nuevo Rubro
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar rubro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFields.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No se encontraron rubros
            </div>
          ) : (
            filteredFields.map((field) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{field.name}</h3>
                  <span className="text-2xl">🛠️</span>
                </div>
                <div className="text-sm text-gray-500 mb-3">
                  {field._count?.professionals || 0} profesionales
                </div>
                <div className="text-xs text-gray-400">
                  Creado: {new Date(field.createdAt).toLocaleDateString("es-ES")}
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                    Editar
                  </button>
                  <button className="flex-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100">
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Mostrando {filteredFields.length} de {fields.length} rubros
        </div>
      </div>
    </div>
  );
}
