"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Trash2, AlertTriangle } from "lucide-react"; // Importamos AlertTriangle
import { useFetch } from "@/src/hooks/useFetch";
import { Modal } from "@/src/components/ui/Modal";
import { AddPortfolioForm, PortfolioFormData } from "./forms/AddPortfolioForm";
import { PortfolioItem } from "@/types";
import { getFullImageUrl } from "@/src/lib/utils";
import { toast } from "react-toastify";

interface Props {
  username: string;
  userFields: { id: string; name: string }[];
}

export const PortfolioManager = ({ username, userFields }: Props) => {
  const {
    data: initialItems,
    loading,
    refetch,
  } = useFetch<PortfolioItem[]>(`/api/auth/portfolio/${username}`);

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (initialItems) setItems(initialItems);
  }, [initialItems]);

  const handleCreate = async (data: PortfolioFormData) => {
    setIsSaving(true);
    try {
      const createRes = await fetch("/api/profile/me/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          fieldId: data.fieldId,
          images: [],
        }),
      });

      if (!createRes.ok) {
        const errorBody = await createRes.text();
        console.error("❌ ERROR DEL BACKEND:", errorBody);
        console.error("❌ STATUS:", createRes.status);
        throw new Error(`Backend Error (${createRes.status}): ${errorBody}`);
      }

      const newItem = await createRes.json();
      const itemId = newItem.id;

      const errors: string[] = [];

      const uploadPromises = data.files.map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("description", file.name);
        formData.append("order", index.toString());

        try {
          const imgRes = await fetch(
            `/api/profile/me/portfolio/${itemId}/image`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!imgRes.ok) {
            const errText = await imgRes.text();
            console.error(`❌ Falló subida de imagen ${file.name}:`, errText);
            errors.push(`Error al subir ${file.name}`);
          } else {
            console.log(`✅ Imagen subida: ${file.name}`);
          }
        } catch (error) {
          console.error(`❌ Error de red al subir ${file.name}:`, error);
          errors.push(`Error de red al subir ${file.name}`);
        }
      });

      await Promise.all(uploadPromises);

      if (errors.length > 0) {
        toast.error(
          `Algunas imágenes no se pudieron subir:\n${errors.join("\n")}`
        );
      } else {
        toast.success("Proyecto creado correctamente");
      }

      await refetch();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error al crear el proyecto.");
    } finally {
      setIsSaving(false);
    }
  };
  const promptDelete = (id: string) => {
    setItemToDelete(id);
  };
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    // UI Optimista
    const prevItems = items;
    setItems(items.filter((i) => i.id !== itemToDelete));
    setItemToDelete(null);

    try {
      const res = await fetch(`/api/profile/me/portfolio/${itemToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Proyecto eliminado");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo borrar el proyecto");
      setItems(prevItems);
    }
  };

  if (loading && items.length === 0)
    return (
      <div className="p-4 text-center text-gray-400">
        Cargando portafolio...
      </div>
    );

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Mi Portafolio</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-800 transition-transform active:scale-95"
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items?.map((item) => (
          <div
            key={item.id}
            className="relative group rounded-xl overflow-hidden border border-gray-100 aspect-4/3"
          >
            {item.images && item.images.length > 0 ? (
              (() => {
                const imgUrl = getFullImageUrl(item.images[0].imageUrl);
                // Detectamos si es entorno local
                const isLocal =
                  imgUrl.includes("localhost") || imgUrl.includes("127.0.0.1");
                return (
                  <Image
                    src={imgUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized={isLocal}
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                );
              })()
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                Sin foto
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-white font-bold truncate">{item.title}</p>

              {/* Botón de borrar llama a promptDelete */}
              <button
                onClick={() => promptDelete(item.id)}
                className="absolute top-2 right-2 p-2 bg-white/20 text-white rounded-full hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
            No tienes proyectos cargados.
          </div>
        )}
      </div>

      {/* --- MODAL DE CREACIÓN --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nuevo Proyecto"
      >
        <AddPortfolioForm
          userFields={userFields}
          onSave={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSaving}
        />
      </Modal>

      {/* --- NUEVO MODAL DE CONFIRMACIÓN DE BORRADO --- */}
      <Modal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        title="Eliminar Proyecto"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-gray-600">
              ¿Estás seguro de que quieres eliminar este proyecto?
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="flex gap-3 w-full pt-4">
            <button
              onClick={() => setItemToDelete(null)}
              className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-2.5 px-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
            >
              Sí, Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
