"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OurButton from "../ui/OurButton";
import { Field, ServiceArea } from "@tembiapo/db";
import { AreaSelector } from "./AreaSelector";
import { FieldSelector } from "./FieldSelector";

interface CreateProfessionalFormProps {
  fields: Field[];
  serviceAreas: ServiceArea[];
}

interface SelectedItem {
  id: string;
  isMain: boolean;
}

export function CreateProfessionalForm({
  fields,
  serviceAreas,
}: CreateProfessionalFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  // Form State
  const [biography, setBiography] = useState("");
  const [whatsappContact, setWhatsappContact] = useState("");
  const [selectedFields, setSelectedFields] = useState<SelectedItem[]>([]);
  const [selectedAreas, setSelectedAreas] = useState<SelectedItem[]>([]);

  // Toggling Logic
  const toggleField = (id: string) => {
    const exists = selectedFields.find((f) => f.id === id);
    if (exists) {
      // Remove
      removeField(id);
    } else {
      // Add
      const isFirst = selectedFields.length === 0;
      setSelectedFields([...selectedFields, { id, isMain: isFirst }]);
    }
  };

  const toggleArea = (id: string) => {
    const exists = selectedAreas.find((a) => a.id === id);
    if (exists) {
      // Remove
      removeArea(id);
    } else {
      // Add
      const isFirst = selectedAreas.length === 0;
      setSelectedAreas([...selectedAreas, { id, isMain: isFirst }]);
    }
  };

  const removeField = (id: string) => {
    const newFields = selectedFields.filter((f) => f.id !== id);
    if (newFields.length > 0 && !newFields.some((f) => f.isMain)) {
      newFields[0].isMain = true;
    }
    setSelectedFields(newFields);
  };

  const removeArea = (id: string) => {
    const newAreas = selectedAreas.filter((a) => a.id !== id);
    if (newAreas.length > 0 && !newAreas.some((a) => a.isMain)) {
      newAreas[0].isMain = true;
    }
    setSelectedAreas(newAreas);
  };

  const setMainField = (id: string) => {
    setSelectedFields(
      selectedFields.map((f) => ({ ...f, isMain: f.id === id }))
    );
  };

  const setMainArea = (id: string) => {
    setSelectedAreas(selectedAreas.map((a) => ({ ...a, isMain: a.id === id })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!biography.trim()) {
      setMessage({ type: "error", text: "La biografía es requerida." });
      return;
    }
    if (!whatsappContact.trim() || !/^\d+$/.test(whatsappContact)) {
      setMessage({
        type: "error",
        text: "El número de WhatsApp debe contener solo números.",
      });
      return;
    }
    if (selectedFields.length === 0) {
      setMessage({
        type: "error",
        text: "Debes seleccionar al menos un rubro.",
      });
      return;
    }
    if (selectedAreas.length === 0) {
      setMessage({
        type: "error",
        text: "Debes seleccionar al menos un área de servicio.",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        biography,
        whatsappContact,
        fields: selectedFields,
        serviceAreas: selectedAreas,
      };

      const res = await fetch("/api/profile/professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Handle non-JSON responses gracefully
      let data;
      try {
        data = await res.json();
      } catch (err) {
        data = null;
      }

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Perfil profesional creado exitosamente.",
        });
        setTimeout(() => {
          window.location.href = "/"; // Force refresh to update context
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: data?.message || `Error al crear perfil: ${res.status}`,
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Error de conexión. Intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8 border border-gray-100 mx-auto my-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif text-parana-profundo font-bold mb-2">
          Crear Perfil Profesional
        </h1>
        <p className="text-gray-500">
          Completa los datos para ofrecer tus servicios
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Biography */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biografía
          </label>
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all bg-white text-gray-900 min-h-[120px]"
            placeholder="Cuéntanos sobre tu experiencia y servicios..."
            required
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contacto WhatsApp (Solo números)
          </label>
          <input
            type="text"
            value={whatsappContact}
            onChange={(e) =>
              setWhatsappContact(e.target.value.replace(/\D/g, ""))
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-parana-profundo focus:border-transparent outline-none transition-all bg-white text-gray-900"
            placeholder="595981123456"
            required
          />
        </div>

        {/* Componente de Rubros (Grid) */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Selecciona tus Rubros (Haz click para seleccionar)
          </label>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <FieldSelector
              fields={fields}
              selectedIds={selectedFields.map((f) => f.id)}
              onToggle={toggleField}
            />

            {/* List of selected items to manage 'Main' status */}
            {selectedFields.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-semibold">
                  Rubros seleccionados{" "}
                  <span className="text-gray-400 font-normal">
                    (Marca el principal)
                  </span>
                </p>
                <div className="space-y-2">
                  {selectedFields.map((sf) => {
                    const fieldName = fields.find((f) => f.id === sf.id)?.name;
                    return (
                      <div
                        key={sf.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          sf.isMain
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        <span className="font-medium text-gray-800">
                          {fieldName}
                        </span>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900 select-none">
                            <input
                              type="radio"
                              checked={sf.isMain}
                              onChange={() => setMainField(sf.id)}
                              className="w-4 h-4 text-parana-profundo focus:ring-parana-profundo border-gray-300"
                            />
                            Principal
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Areas (Grid) */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Selecciona tus Áreas de Servicio (Haz click para seleccionar)
          </label>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <AreaSelector
              serviceAreas={serviceAreas}
              selectedIds={selectedAreas.map((a) => a.id)}
              onToggle={toggleArea}
            />

            {/* List of selected items to manage 'Main' status */}
            {selectedAreas.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide font-semibold">
                  Áreas seleccionadas{" "}
                  <span className="text-gray-400 font-normal">
                    (Marca la principal)
                  </span>
                </p>
                <div className="space-y-2">
                  {selectedAreas.map((sa) => {
                    const area = serviceAreas.find((a) => a.id === sa.id);
                    return (
                      <div
                        key={sa.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          sa.isMain
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        <span className="font-medium text-gray-800">
                          {area?.city}, {area?.province}
                        </span>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900 select-none">
                            <input
                              type="radio"
                              checked={sa.isMain}
                              onChange={() => setMainArea(sa.id)}
                              className="w-4 h-4 text-parana-profundo focus:ring-parana-profundo border-gray-300"
                            />
                            Principal
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm text-center border ${
              message.type === "error"
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-green-50 text-green-600 border-green-100"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="pt-4">
          <div className="w-full h-12">
            <OurButton
              frontColor="var(--color-parana-profundo)"
              textColor="var(--color-blanco-puro)"
              shadowColor="var(--color-gris-oscuro)"
              outlineColor="var(--color-parana-profundo)"
            >
              {loading ? "Creando perfil..." : "FINALIZAR REGISTRO"}
            </OurButton>
          </div>
        </div>
      </form>
    </div>
  );
}
