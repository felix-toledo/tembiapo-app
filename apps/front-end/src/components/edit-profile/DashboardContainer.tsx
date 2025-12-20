"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { UIField, UIServiceArea } from "@/types";
import { Professional } from "@/src/context/AuthContext";
import { toast } from "react-toastify";
import { compressImage } from "@/lib/image-optimization-helper";

// Componentes Visuales
import { EditProfileSidebar } from "./EditProfileSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { VerificationBanner } from "./VerificationBanner";
import { DashboardStats } from "./DashboardStats";
import { Modal } from "@/src/components/ui/Modal";
import LoaderWaiter from "@/src/components/ui/loaders/LoaderWaiter";

// Formularios y Modales
import { EditDescriptionForm } from "./forms/EditDescriptionForm";
import { EditSkillsForm } from "./forms/EditSkillsForm";
import { EditCitiesForm } from "./forms/EditCitiesForm";
// 👇 1. Importamos el nuevo Modal de Teléfono
import { EditPhoneModal } from "./forms/EditPhoneModal";

// Gestor de Portafolio
import { PortfolioManager } from "./PortfolioManager";
import { PortfolioItem } from "@/types";

import { Field, ServiceArea } from "@tembiapo/db";
import { useFetch } from "@/src/hooks/useFetch";
import { getFakeRating } from "@/src/lib/utils";

interface Props {
  availableFields: Field[];
  availableAreas: ServiceArea[];
}

export const DashboardContainer = ({
  availableFields,
  availableAreas,
}: Props) => {
  // 1. CONSUMIR DATOS DEL CONTEXTO (Global State)
  const { professional, loading: authLoading, fetchProfessional } = useAuth();

  // 2. Estado local para actualizaciones optimistas
  const [localUserUpdates, setLocalUserUpdates] = useState<Professional | null>(
    null
  );

  // 👇 2. Agregamos "phone" al tipo de modal activo
  const [activeModal, setActiveModal] = useState<
    "description" | "skills" | "cities" | "phone" | null
  >(null);

  // 3. Estado Derivado
  const displayUser = localUserUpdates || professional;

  const {
    data: portfolioItems,
    loading: loadingPortfolio,
    refetch: refreshPortfolio,
  } = useFetch<PortfolioItem[]>(
    displayUser?.username ? `/api/auth/portfolio/${displayUser.username}` : ""
  );

  // Reseteamos ediciones locales si el perfil cambia
  useEffect(() => {
    if (professional) {
      setLocalUserUpdates(null);
    }
  }, [professional]);

  // --- LÓGICA DE ACTUALIZACIÓN GENÉRICA ---
  // Esta función cierra el modal automáticamente (usada para desc, skills, cities)
  const updateProfile = async (updatedFields: Partial<Professional>) => {
    if (!displayUser) return;

    const optimisticUpdate = {
      ...displayUser,
      ...updatedFields,
    } as Professional;

    setLocalUserUpdates(optimisticUpdate);
    setActiveModal(null); // Cierra el modal inmediatamente para optimismo

    // Payload para Backend
    const payload = {
      biography: optimisticUpdate.description,
      whatsappContact: optimisticUpdate.whatsappContact || "",
      fields: (optimisticUpdate.fields || []).map((f) => ({
        id: f.id,
        isMain: f.isMain,
      })),
      serviceAreas: (optimisticUpdate.area || []).map((a) => ({
        id: a.id,
        isMain: a.isMain,
      })),
    };

    try {
      const res = await fetch("/api/profile/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error server");

      toast.success("Perfil actualizado correctamente");
      await fetchProfessional();
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      toast.error("Hubo un error al guardar los cambios.");
      setLocalUserUpdates(null);
    }
  };

  // --- LÓGICA DE ACTUALIZACIÓN ESPECÍFICA PARA TELÉFONO ---
  const handleSavePhone = async (newPhone: string) => {
    if (!displayUser) return;

    // Construimos el payload completo usando el usuario actual + nuevo teléfono
    const payload = {
      biography: displayUser.description,
      whatsappContact: newPhone,
      fields: (displayUser.fields || []).map((f) => ({
        id: f.id,
        isMain: f.isMain,
      })),
      serviceAreas: (displayUser.area || []).map((a) => ({
        id: a.id,
        isMain: a.isMain,
      })),
    };

    const res = await fetch("/api/profile/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Error al guardar teléfono");
    toast.success("WhatsApp actualizado correctamente");
    await fetchProfessional();
  };

  // Handlers para los otros forms
  const handleSaveDescription = (newDesc: string) =>
    updateProfile({ description: newDesc });
  const handleSaveSkills = (newFields: UIField[]) =>
    updateProfile({ fields: newFields });
  const handleSaveCities = (newAreas: UIServiceArea[]) =>
    updateProfile({ area: newAreas });

  // Validaciones de carga
  if (authLoading)
    return (
      <LoaderWaiter
        messages={["Cargando tu panel...", "Sincronizando perfil..."]}
      />
    );

  if (!displayUser)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          No se encontró perfil profesional
        </h2>
        <p className="text-gray-500">
          Parece que tu cuenta no tiene un perfil profesional asociado.
        </p>
      </div>
    );

  // Adaptadores para UI
  const skillNames = displayUser.fields?.map((f) => f.name) || [];
  const cityNames = displayUser.area?.map((a) => a.city) || [];
  const fullName = `${displayUser.name} ${displayUser.lastName}`;
  const jobsCount = portfolioItems ? portfolioItems.length : 0;
  const rating = getFakeRating(displayUser.professionalId);
  const stats = { jobsCount, rating };

  // Handler Avatar
  const handleAvatarChange = async (file: File) => {
    try {
      // Compress image in browser BEFORE upload
      const compressedFile = await compressImage(file);

      const formData = new FormData();
      formData.append("avatar", compressedFile);

      const updatePromise = fetch("/api/profile/me", {
        method: "PUT",
        body: formData,
      }).then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Error al subir imagen");
        }
        return res.json();
      });

      toast.promise(updatePromise, {
        pending: "Subiendo nueva foto...",
        success: "Foto de perfil actualizada 👌",
        error: "Hubo un error al subir la foto 🤯",
      });

      await updatePromise;
      await fetchProfessional();
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Error al procesar la imagen");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-1 lg:top-24">
          <EditProfileSidebar
            avatarUrl={displayUser.avatarURL}
            description={displayUser.description}
            skills={skillNames}
            cities={cityNames}
            phone={displayUser.whatsappContact || ""} // Pasamos el teléfono
            onEditDescription={() => setActiveModal("description")}
            onEditSkills={() => setActiveModal("skills")}
            onEditCities={() => setActiveModal("cities")}
            onEditPhone={() => setActiveModal("phone")} // 👇 4. Evento abrir modal
            onAvatarChange={handleAvatarChange}
          />
        </div>

        {/* COLUMNA DERECHA */}
        <div className="lg:col-span-2 space-y-8">
          <DashboardHeader
            name={fullName}
            profession={
              displayUser.fields?.find((f) => f.isMain)?.name ||
              displayUser.fields?.[0]?.name ||
              "Profesional"
            }
            username={displayUser.username}
            isPremium={displayUser.isPremium}
            isVerified={displayUser.isVerified}
          />

          {!displayUser.isVerified && <VerificationBanner />}

          <DashboardStats
            jobs={stats.jobsCount}
            rating={stats.rating}
            isVerified={displayUser.isVerified}
          />

          {/* GESTIÓN DE PORTFOLIO */}
          {displayUser.isVerified && displayUser.username ? (
            <PortfolioManager
              username={displayUser.username}
              userFields={displayUser.fields || []}
              initialItems={portfolioItems || []}
              isLoading={loadingPortfolio}
              onUpdate={refreshPortfolio}
            />
          ) : (
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 border-dashed flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                🔒
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Portafolio Bloqueado
              </h3>
              <p className="text-gray-500 max-w-sm">
                Solo los profesionales verificados pueden subir fotos de sus
                trabajos. Completa tu verificación para desbloquear esta
                función.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALES EXISTENTES --- */}
      <Modal
        isOpen={activeModal === "description"}
        onClose={() => setActiveModal(null)}
        title="Editar Descripción"
      >
        <EditDescriptionForm
          initialDescription={displayUser.description || ""}
          onSave={handleSaveDescription}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>

      <Modal
        isOpen={activeModal === "skills"}
        onClose={() => setActiveModal(null)}
        title="Editar Habilidades"
      >
        <EditSkillsForm
          initialFields={(displayUser.fields || []).map((f) => ({
            ...f,
            lucide_icon: null,
            createdAt: new Date(),
            updatedAt: null,
          }))}
          availableOptions={availableFields}
          onSave={handleSaveSkills}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>

      <Modal
        isOpen={activeModal === "cities"}
        onClose={() => setActiveModal(null)}
        title="Editar Ciudades"
      >
        <EditCitiesForm
          initialAreas={(displayUser.area || []).map((a) => ({
            ...a,
            createdAt: new Date(),
            updatedAt: null,
          }))}
          availableOptions={availableAreas}
          onSave={handleSaveCities}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>

      {/* 👇 5. Renderizamos el Modal de Teléfono */}
      <EditPhoneModal
        isOpen={activeModal === "phone"}
        onClose={() => setActiveModal(null)}
        initialPhone={displayUser.whatsappContact || ""}
        onSave={handleSavePhone}
      />
    </>
  );
};
