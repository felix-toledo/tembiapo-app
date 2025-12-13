"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OurButton from "../ui/OurButton";
import { Field, ServiceArea } from "@tembiapo/db";

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

  // Selection inputs
  const [currentFieldId, setCurrentFieldId] = useState("");
  const [currentAreaId, setCurrentAreaId] = useState("");

  const handleAddField = () => {
    if (!currentFieldId) return;
    if (selectedFields.some((f) => f.id === currentFieldId)) return;

    const isFirst = selectedFields.length === 0;
    setSelectedFields([
      ...selectedFields,
      { id: currentFieldId, isMain: isFirst },
    ]);
    setCurrentFieldId("");
  };

  const handleAddArea = () => {
    if (!currentAreaId) return;
    if (selectedAreas.some((a) => a.id === currentAreaId)) return;

    const isFirst = selectedAreas.length === 0;
    setSelectedAreas([
      ...selectedAreas,
      { id: currentAreaId, isMain: isFirst },
    ]);
    setCurrentAreaId("");
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

      const res = await fetch("/api/v1/profile/professional", {
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

        {/* Fields Selector */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rubros
          </label>
          <div className="flex gap-2 mb-2">
            <select
              value={currentFieldId}
              onChange={(e) => setCurrentFieldId(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-parana-profundo outline-none bg-white text-gray-900"
            >
              <option value="">Seleccionar rubro...</option>
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddField}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Agregar
            </button>
          </div>

          <div className="space-y-2 mt-4">
            {selectedFields.map((sf) => {
              const fieldName = fields.find((f) => f.id === sf.id)?.name;
              return (
                <div
                  key={sf.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    sf.isMain
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <span className="font-medium">{fieldName}</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                      <input
                        type="radio"
                        checked={sf.isMain}
                        onChange={() => setMainField(sf.id)}
                        className="text-parana-profundo focus:ring-parana-profundo"
                      />
                      Principal
                    </label>
                    <button
                      type="button"
                      onClick={() => removeField(sf.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Areas Selector */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Áreas de Servicio
          </label>
          <div className="flex gap-2 mb-2">
            <select
              value={currentAreaId}
              onChange={(e) => setCurrentAreaId(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-parana-profundo outline-none bg-white text-gray-900"
            >
              <option value="">Seleccionar área...</option>
              {serviceAreas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.city}, {a.province}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddArea}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Agregar
            </button>
          </div>

          <div className="space-y-2 mt-4">
            {selectedAreas.map((sa) => {
              const area = serviceAreas.find((a) => a.id === sa.id);
              return (
                <div
                  key={sa.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    sa.isMain
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <span className="font-medium">
                    {area?.city}, {area?.province}
                  </span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                      <input
                        type="radio"
                        checked={sa.isMain}
                        onChange={() => setMainArea(sa.id)}
                        className="text-parana-profundo focus:ring-parana-profundo"
                      />
                      Principal
                    </label>
                    <button
                      type="button"
                      onClick={() => removeArea(sa.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
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
