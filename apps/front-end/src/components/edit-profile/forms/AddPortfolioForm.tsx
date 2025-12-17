"use client";

import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";

export interface PortfolioFormData {
  title: string;
  description: string;
  fieldId: string;
  files: File[];
}

interface Props {
  userFields: { id: string; name: string }[];
  onSave: (data: PortfolioFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const AddPortfolioForm = ({
  userFields,
  onSave,
  onCancel,
  isLoading,
}: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fieldId, setFieldId] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      selectedFiles.forEach((file) => {
        // 10MB limit
        if (file.size > 10 * 1024 * 1024) {
          invalidFiles.push(file.name);
        } else {
          validFiles.push(file);
        }
      });

      if (invalidFiles.length > 0) {
        toast.error(
          `Los siguientes archivos son muy pesados (max 10MB):\n- ${invalidFiles.join("\n- ")}`
        );
      }

      setFiles([...files, ...validFiles]);
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fieldId || files.length === 0) {
      toast.error(
        "Completa el título, selecciona un rubro y agrega al menos una foto."
      );
      return;
    }
    await onSave({ title, description, fieldId, files });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selector de Rubro (FieldId) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rubro del trabajo
        </label>
        <select
          value={fieldId}
          onChange={(e) => setFieldId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-black outline-none"
        >
          <option value="">Selecciona una categoría...</option>
          {userFields.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-black outline-none"
          placeholder="Ej: Mesa de roble"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-black outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imágenes
        </label>
        <div className="grid grid-cols-3 gap-4">
          {previews.map((src, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden border"
            >
              <Image src={src} alt="Preview" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-black hover:bg-gray-50">
            <Upload className="text-gray-400" size={24} />
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-3 bg-gray-100 rounded-xl"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading ? "Guardando..." : "Crear Proyecto"}
        </button>
      </div>
    </form>
  );
};
