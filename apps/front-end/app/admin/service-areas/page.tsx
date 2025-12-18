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
  _count?: {
    professionals: number;
  };
}

export default function ServiceAreas() {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingArea, setEditingArea] = useState<ServiceArea | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchAreas();
  }, []);

  async function fetchAreas() {
    try {
      const res = await fetch("/api/service-areas");
      const data = await res.json();
      
      // El backend puede devolver el array directamente o envuelto en { success, data }
      if (Array.isArray(data)) {
        setAreas(data);
      } else if (data.success && data.data) {
        setAreas(data.data);
      }
    } catch (error) {
      console.error("Error fetching service areas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(area: ServiceArea) {
    setEditingArea(area);
    setIsCreating(false);
    setIsModalOpen(true);
  }

  function handleCreate() {
    setEditingArea({
      id: "",
      city: "",
      province: "",
      country: "Argentina",
      postalCode: "",
      createdAt: new Date().toISOString(),
    });
    setIsCreating(true);
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!editingArea) return;

    try {
      if (isCreating) {
        // Crear nueva área
        const res = await fetch("/api/service-areas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: editingArea.city,
            province: editingArea.province,
            country: editingArea.country,
            postalCode: editingArea.postalCode,
          }),
        });

        if (res.ok) {
          await fetchAreas();
          setIsModalOpen(false);
          setEditingArea(null);
          setIsCreating(false);
        }
      } else {
        // Actualizar área existente
        const res = await fetch(`/api/service-areas/${editingArea.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: editingArea.city,
            province: editingArea.province,
            country: editingArea.country,
            postalCode: editingArea.postalCode,
          }),
        });

        if (res.ok) {
          await fetchAreas();
          setIsModalOpen(false);
          setEditingArea(null);
        }
      }
    } catch (error) {
      console.error("Error saving area:", error);
    }
  }

  async function handleDelete(id: string) {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      const res = await fetch(`/api/service-areas/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchAreas();
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting area:", error);
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
          <h1 className="text-3xl font-bold text-gray-900">Áreas de Servicio</h1>
          <p className="text-gray-700 mt-2">Gestión de zonas de cobertura</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
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
            className="text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  Usuarios
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-900">
                          {area._count?.professionals || 0}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">profesionales</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(area)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(area.id)}
                        className={`${
                          deleteConfirm === area.id
                            ? "text-red-900 font-bold"
                            : "text-red-600 hover:text-red-900"
                        }`}
                      >
                        {deleteConfirm === area.id ? "¿Confirmar?" : "Eliminar"}
                      </button>
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

      {/* Modal de Edición/Creación */}
      {isModalOpen && editingArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {isCreating ? "Nueva Área" : "Editar Área"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={editingArea.city}
                  onChange={(e) => setEditingArea({ ...editingArea, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                <input
                  type="text"
                  value={editingArea.province}
                  onChange={(e) => setEditingArea({ ...editingArea, province: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                <input
                  type="text"
                  value={editingArea.country}
                  onChange={(e) => setEditingArea({ ...editingArea, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                <input
                  type="text"
                  value={editingArea.postalCode}
                  onChange={(e) => setEditingArea({ ...editingArea, postalCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingArea(null);
                  setIsCreating(false);
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
