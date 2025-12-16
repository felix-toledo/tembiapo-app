"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { UIField, UIServiceArea } from '@/types';
import { Professional } from '@/src/context/AuthContext'; 

// Componentes Visuales
import { EditProfileSidebar } from './EditProfileSidebar';
import { DashboardHeader } from './DashboardHeader';
import { VerificationBanner } from './VerificationBanner';
import { DashboardStats } from './DashboardStats';
import { Modal } from '@/src/components/ui/Modal';
import LoaderWaiter from '@/src/components/ui/loaders/LoaderWaiter';

// Formularios
import { EditDescriptionForm } from './forms/EditDescriptionForm';
import { EditSkillsForm } from './forms/EditSkillsForm';
import { EditCitiesForm } from './forms/EditCitiesForm';

// Gestor de Portafolio
import { PortfolioManager } from './PortfolioManager';

import { Field, ServiceArea } from '@tembiapo/db';

interface Props {
  availableFields: Field[]; 
  availableAreas: ServiceArea[];
}

export const DashboardContainer = ({ availableFields, availableAreas }: Props) => {
  // 1. CONSUMIR DATOS DEL CONTEXTO (Global State)
  const { professional, loading: authLoading, fetchProfessional } = useAuth();

  // 2. Estado local para actualizaciones optimistas
  const [localUserUpdates, setLocalUserUpdates] = useState<Professional | null>(null);
  const [activeModal, setActiveModal] = useState<'description' | 'skills' | 'cities' | null>(null);

  // 3. Estado Derivado: Preferimos la edición local si existe, sino el dato del contexto
  const displayUser = localUserUpdates || professional;

  // Reseteamos ediciones locales si el perfil profesional cambia (ej. recarga desde servidor)
  useEffect(() => {
    if (professional) {
        setLocalUserUpdates(null);
    }
  }, [professional]);

  // --- LÓGICA DE ACTUALIZACIÓN ---
  const updateProfile = async (updatedFields: Partial<Professional>) => {
    if (!displayUser) return;

    const optimisticUpdate = { ...displayUser, ...updatedFields } as Professional;
    setLocalUserUpdates(optimisticUpdate);
    setActiveModal(null);

    // B. Payload para Backend
    const payload = {
      biography: optimisticUpdate.description,
      whatsappContact: optimisticUpdate.whatsappContact || "",
      fields: (optimisticUpdate.fields || []).map(f => ({ id: f.id, isMain: f.isMain })),
      serviceAreas: (optimisticUpdate.area || []).map(a => ({ id: a.id, isMain: a.isMain }))
    };

    try {
      const res = await fetch('/api/profile/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error server");
      
      console.log("✅ Perfil guardado exitosamente");

      // C. ACTUALIZACIÓN GLOBAL
      await fetchProfessional(); 

    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      alert("Hubo un error al guardar los cambios.");
      setLocalUserUpdates(null);
    }
  };

  // Handlers
  const handleSaveDescription = (newDesc: string) => updateProfile({ description: newDesc });
  const handleSaveSkills = (newFields: UIField[]) => updateProfile({ fields: newFields });
  const handleSaveCities = (newAreas: UIServiceArea[]) => updateProfile({ area: newAreas });

  // Validaciones
  if (authLoading) return <LoaderWaiter messages={["Cargando tu panel...", "Sincronizando perfil..."]} />;
  
  // Si no hay perfil profesional cargado (y no está cargando), mostramos error
  if (!displayUser) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">No se encontró perfil profesional</h2>
        <p className="text-gray-500">Parece que tu cuenta no tiene un perfil profesional asociado.</p>
    </div>
  );

  // Adaptadores
  const skillNames = displayUser.fields?.map(f => f.name) || [];
  const cityNames = displayUser.area?.map(a => a.city) || [];
  const fullName = `${displayUser.name} ${displayUser.lastName}`;
  // Nota: Si 'stats' no está en tu interfaz Professional del contexto, usa defaults:
  const stats = { jobsCompleted: 0, rating: 0 }; 

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <EditProfileSidebar 
            avatarUrl={displayUser.avatarURL}
            description={displayUser.description}
            skills={skillNames}
            cities={cityNames}
            onEditDescription={() => setActiveModal('description')}
            onEditSkills={() => setActiveModal('skills')}
            onEditCities={() => setActiveModal('cities')}
          />
        </div>

        {/* COLUMNA DERECHA */}
        <div className="lg:col-span-2 space-y-8">
          <DashboardHeader name={fullName} profession={skillNames[0] || "Profesional"} />
          
          {!displayUser.isVerified && <VerificationBanner />}
          
          <DashboardStats jobs={stats.jobsCompleted} rating={stats.rating} />
          
          {/* GESTIÓN DE PORTFOLIO */}
          {displayUser.isVerified && displayUser.username ? (
             <PortfolioManager 
                username={displayUser.username}
                userFields={displayUser.fields || []}
             />
          ) : (
             <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 border-dashed flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-3xl">🔒</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Portafolio Bloqueado</h3>
                <p className="text-gray-500 max-w-sm">
                  Solo los profesionales verificados pueden subir fotos de sus trabajos. 
                  Completa tu verificación para desbloquear esta función.
                </p>
             </div>
          )}

        </div>
      </div>

      {/* MODALES */}
      <Modal isOpen={activeModal === 'description'} onClose={() => setActiveModal(null)} title="Editar Descripción">
        <EditDescriptionForm 
          initialDescription={displayUser.description || ""}
          onSave={handleSaveDescription}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>

      <Modal isOpen={activeModal === 'skills'} onClose={() => setActiveModal(null)} title="Editar Habilidades">
        <EditSkillsForm 
          initialFields={(displayUser.fields || []).map(f => ({
            ...f,
            lucide_icon: null,       // Valor dummy
            createdAt: new Date(),   // Valor dummy
            updatedAt: null          // Valor dummy
          }))}
          availableOptions={availableFields}
          onSave={handleSaveSkills}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>

       <Modal isOpen={activeModal === 'cities'} onClose={() => setActiveModal(null)} title="Editar Ciudades">
        <EditCitiesForm 
          initialAreas={(displayUser.area || []).map(a => ({
            ...a,
            createdAt: new Date(), // Valor dummy
            updatedAt: null        // Valor dummy
          }))}
          availableOptions={availableAreas}
          onSave={handleSaveCities}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>
    </>
  );
};