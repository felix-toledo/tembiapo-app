"use client";

import React, { useState, useEffect } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { AddPortfolioForm, PortfolioFormData } from "./forms/AddPortfolioForm";
import { PortfolioItem } from "@/types";
import { toast } from "react-toastify";
import { PortfolioCard } from "./PortfolioCard";
import { compressImage } from "@/lib/image-optimization-helper";

interface Props {
  username: string;
  userFields: { id: string; name: string }[];
  initialItems?: PortfolioItem[]; // Lo hacemos opcional por seguridad
  isLoading: boolean;
  onUpdate: () => Promise<void> | void; // Función que viene del padre
}

export const PortfolioManager = ({
  userFields,
  initialItems = [], // Valor por defecto para evitar errores
  isLoading,
  onUpdate,
}: Props) => {
  // Estado local sincronizado con el padre
  const [items, setItems] = useState<PortfolioItem[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Efecto: Cuando el padre actualiza la lista (initialItems), actualizamos el estado local
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

      if (!createRes.ok) throw new Error("Error creando item");
      const newItem = await createRes.json();
      const itemId = newItem.id;

      // Lógica de subida de imágenes con compresión
      const errors: string[] = [];
      const uploadPromises = data.files.map(async (file, index) => {
        try {
          // Compress image in browser BEFORE upload
          const compressedFile = await compressImage(file);

          const formData = new FormData();
          formData.append("file", compressedFile);
          formData.append("description", file.name);
          formData.append("order", index.toString());

          const uploadRes = await fetch(
            `/api/profile/me/portfolio/${itemId}/image`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!uploadRes.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }
        } catch (e) {
          console.error(e);
          errors.push(file.name);
        }
      });

      await Promise.all(uploadPromises);

      if (errors.length === 0) toast.success("Proyecto creado correctamente");
      else toast.warning("Proyecto creado, pero algunas imágenes fallaron");

      await onUpdate();

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

    // Optimismo visual
    const prevItems = items;
    setItems(items.filter((i) => i.id !== itemToDelete));

    // Guardamos ID temporalmente antes de limpiar el estado
    const idToDelete = itemToDelete;
    setItemToDelete(null);

    try {
      const res = await fetch(`/api/profile/me/portfolio/${idToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();

      toast.success("Proyecto eliminado");

      await onUpdate();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo borrar el proyecto");
      setItems(prevItems); // Revertimos si falló
    }
  };

  if (isLoading && items.length === 0)
    return (
      <div className="p-4 text-center text-gray-400 animate-pulse">
        Cargando portafolio...
      </div>
    );

  return (
    <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 md:p-8 border border-gray-100 shadow-sm mt-8">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <h3 className="text-xl font-bold text-gray-900">Mi Portafolio</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-transform active:scale-95 w-full sm:w-auto"
        >
          <Plus size={16} /> Nuevo
        </button>
      </div>

      {/* --- GRID DE PROYECTOS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {items?.map((item) => (
          <PortfolioCard key={item.id} item={item} onDelete={promptDelete} />
        ))}

        {items.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
              <Plus size={20} className="text-gray-400" />
            </div>
            <p>No tienes proyectos cargados.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-sm text-blue-600 font-bold mt-2 hover:underline"
            >
              Cargar el primero
            </button>
          </div>
        )}
      </div>

      {/* --- MODALES (Sin cambios) --- */}
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
