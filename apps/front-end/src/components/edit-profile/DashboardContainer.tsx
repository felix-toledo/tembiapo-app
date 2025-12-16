"use client";

import React, { useState } from 'react';
import { useFetch } from '@/src/hooks/useFetch';
import { ProfessionalResponseDTO } from '@/types';

// Componentes
import { EditProfileSidebar } from './EditProfileSidebar';
import { DashboardHeader } from './DashboardHeader';
import { VerificationBanner } from './VerificationBanner';
import { DashboardStats } from './DashboardStats';
import { Modal } from '@/src/components/ui/Modal';
import { EditDescriptionForm } from './forms/EditDescriptionForm';
import LoaderWaiter from '@/src/components/ui/loaders/LoaderWaiter';

export const DashboardContainer = () => {
  // 1. Fetch de datos
  const { data: apiData, loading, error } = useFetch<ProfessionalResponseDTO>('/api/profile/me');

  // 2. Estado local para EDICIONES (Empieza en null)
  const [localUserUpdates, setLocalUserUpdates] = useState<ProfessionalResponseDTO | null>(null);
  
  const [activeModal, setActiveModal] = useState<'description' | 'skills' | 'cities' | null>(null);

  // 3. ESTADO DERIVADO
  const displayUser = localUserUpdates || apiData;

  // Validaciones de carga
  if (loading) return <LoaderWaiter messages={["Cargando tu panel...", "Obteniendo datos..."]} />;
  
  // Validaciones de error
  if (error || !displayUser) return <div className="p-10 text-center">No se pudo cargar el perfil. Asegúrate de haber iniciado sesión.</div>;

  // 4. ADAPTADORES DE DATOS
  const skillNames = displayUser.fields?.map(f => f.name) || [];
  const cityNames = displayUser.area?.map(a => a.city) || [];
  const fullName = `${displayUser.name} ${displayUser.lastName}`;
  const stats = displayUser.stats || { jobsCompleted: 0, rating: 0 };

  // 5. Handler para guardar descripción
  const handleSaveDescription = (newDesc: string) => {
    // Al guardar, tomamos los datos actuales y sobreescribimos la descripción
    const updatedData = { ...displayUser, description: newDesc };
    
    // Actualizamos el estado local (UI Optimista)
    setLocalUserUpdates(updatedData);
    
    // AQUÍ FALTARÍA: Llamada POST a la API para persistir el cambio
    setActiveModal(null);
  };

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
          
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 border-dashed flex flex-col items-center justify-center text-gray-400 min-h-[200px]">
              <p>Próximamente: Gestión de Portafolio</p>
          </div>
        </div>
      </div>

      {/* --- MODALES --- */}
      <Modal 
        isOpen={activeModal === 'description'} 
        onClose={() => setActiveModal(null)} 
        title="Editar Descripción"
      >
        <EditDescriptionForm 
          initialDescription={displayUser.description || ""}
          onSave={handleSaveDescription}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>

      {/* Otros modales... */}
    </>
  );
};