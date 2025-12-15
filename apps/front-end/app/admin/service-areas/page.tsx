"use client";

import { useEffect, useState } from "react";
import LoaderWaiterMini from "@/src/components/ui/loaders/LoaderWaiterMini";

interface ServiceArea {
  id: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  createdAt: string;
}

export default function ServiceAreas() {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAreas();
  }, []);

  async function fetchAreas() {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/api/v1/service-areas`);
      const data = await res.json();
      
      if (data.success && data.data) {
        setAreas(data.data);
      }
    } catch (error) {
      console.error("Error fetching service areas:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredAreas = areas.filter((area) =>
    area.city.toLowerCase().includes(search.toLowerCase()) ||
    area.province.toLowerCase().includes(search.toLowerCase()) ||
    area.postalCode.includes(search)
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
          <h1 className="text-3xl font-bold">Áreas de Servicio</h1>
          <p className="text-gray-600 mt-2">Gestión de zonas de cobertura</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Nueva Área
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por ciudad, provincia o código postal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ciudad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provincia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  País
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código Postal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No se encontraron áreas
                  </td>
                </tr>
              ) : (
                filteredAreas.map((area) => (
                  <tr key={area.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{area.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{area.province}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{area.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{area.postalCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(area.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                      <button className="text-red-600 hover:text-red-900">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Mostrando {filteredAreas.length} de {areas.length} áreas
        </div>
      </div>
    </div>
  );
}
