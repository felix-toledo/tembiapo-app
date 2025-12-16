"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2 } from 'lucide-react';
import { useFetch } from '@/src/hooks/useFetch';
import { Modal } from '@/src/components/ui/Modal';
import { AddPortfolioForm, PortfolioFormData } from './forms/AddPortfolioForm';
import { PortfolioItem } from '@/types';

interface Props {
    username: string;
    userFields: { id: string; name: string }[];
}

export const PortfolioManager = ({ username, userFields }: Props) => {
    // AHORA SÍ: Usamos refetch nativo
    const { data: initialItems, loading, refetch } = useFetch<PortfolioItem[]>(`/api/auth/portfolio/${username}`);

    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialItems) setItems(initialItems);
    }, [initialItems]);

    const handleCreate = async (data: PortfolioFormData) => {
        setIsSaving(true);
        try {
            // 1. Crear Item (con fieldId)
            const createRes = await fetch('/api/profile/me/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: data.title,
                    description: data.description,
                    fieldId: data.fieldId,
                    images: []
                }),
            });

            if (!createRes.ok) throw new Error("Error al crear el item");
            const newItem = await createRes.json();
            const itemId = newItem.id;

            // 2. Subir Imágenes
            const uploadPromises = data.files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file); // Ajustar key según backend ("file", "image")

                await fetch(`/api/profile/me/portfolio/${itemId}/image`, {
                    method: 'POST',
                    body: formData,
                });
            });

            await Promise.all(uploadPromises);

            // 3. RECARGA LIMPIA
            await refetch();
            setIsModalOpen(false);

        } catch (err) {
            console.error(err);
            alert("Hubo un error al crear el proyecto.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Borrar proyecto?")) return;

        // UI Optimista (lo borramos visualmente primero)
        const prevItems = items;
        setItems(items.filter(i => i.id !== id));

        try {
            const res = await fetch(`/api/profile/me/portfolio/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();

            // Confirmamos con refetch en segundo plano para asegurar consistencia
            refetch();
        } catch (err) {
            console.error(err);
            alert("Error al borrar");
            setItems(prevItems); // Rollback si falla
        }
    };

    if (loading && items.length === 0) return <div className="p-4 text-center text-gray-400">Cargando portafolio...</div>;

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
                {items?.map(item => (
                    <div key={item.id} className="relative group rounded-xl overflow-hidden border border-gray-100 aspect-4/3">
                        {item.images && item.images.length > 0 ? (
                            <Image src={item.images[0].imageUrl} alt={item.title} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Sin foto</div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                            <p className="text-white font-bold">{item.title}</p>
                            <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Proyecto">
                <AddPortfolioForm
                    userFields={userFields}
                    onSave={handleCreate}
                    onCancel={() => setIsModalOpen(false)}
                    isLoading={isSaving}
                />
            </Modal>
        </div>
    );
};