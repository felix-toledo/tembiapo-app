"use client";

import { useEffect, useState } from "react";
import LoaderWaiterMini from "@/src/components/ui/loaders/LoaderWaiterMini";
import { toast } from "react-toastify";

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

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFields();
  }, []);

  async function fetchFields() {
    try {
      const res = await fetch("/api/fields");
      const data = await res.json();

      if (Array.isArray(data)) {
        setFields(data);
      } else if (data.success && data.data) {
        setFields(data.data);
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
      toast.error("Error al cargar rubros");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      const url = editingField
        ? `/api/fields/${editingField.id}`
        : "/api/fields";

      const method = editingField ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error en la operación");

      const data = await res.json();

      toast.success(editingField ? "Rubro actualizado" : "Rubro creado");
      fetchFields();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el rubro");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este rubro?")) return;

    try {
      const res = await fetch(`/api/fields/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      toast.success("Rubro eliminado");
      fetchFields();
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el rubro");
    }
  };

  const openModal = (field?: Field) => {
    if (field) {
      setEditingField(field);
      setFormData({ name: field.name });
    } else {
      setEditingField(null);
      setFormData({ name: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingField(null);
    setFormData({ name: "" });
  };

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
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
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
            className="text-gray-700 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    {field.name}
                  </h3>
                  <span className="text-2xl">🛠️</span>
                </div>
                <div className="text-xs text-gray-400">
                  Creado:{" "}
                  {new Date(field.createdAt).toLocaleDateString("es-ES")}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openModal(field)}
                    className="flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(field.id)}
                    className="flex-1 px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                  >
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              {editingField ? "Editar Rubro" : "Nuevo Rubro"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Ej: Plomería"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
