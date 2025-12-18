"use client";

import { useState, useEffect } from "react";
import { X, Phone, Save, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialPhone: string;
  onSave: (newPhone: string) => Promise<void>; // Promesa para manejar loading
}

export const EditPhoneModal = ({ isOpen, onClose, initialPhone, onSave }: Props) => {
  const [phone, setPhone] = useState(initialPhone);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Reseteamos el valor cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setPhone(initialPhone || "");
      setError("");
      setIsLoading(false);
    }
  }, [isOpen, initialPhone]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple
    if (!phone.trim()) {
      setError("El número no puede estar vacío.");
      return;
    }

    // Validación de formato básico (solo permite números, espacios, +, -)
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    if (!phoneRegex.test(phone)) {
      setError("Ingresa un formato de teléfono válido.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await onSave(phone);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al guardar. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Contenedor del Modal */}
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <div className="p-1.5 bg-green-100 text-green-600 rounded-full">
              <Phone size={18} />
            </div>
            Editar WhatsApp
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-500 text-sm mb-4">
            Este número será visible en tu perfil para que los clientes te contacten directamente.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Número de teléfono
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+54 9 11 1234 5678"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                    error ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-blue-100 focus:border-blue-500"
                  } focus:outline-hidden focus:ring-4 transition-all text-gray-900 font-medium`}
                  disabled={isLoading}
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              {error && (
                <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium animate-pulse">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Footer (Botones) */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};