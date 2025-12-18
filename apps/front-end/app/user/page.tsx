import React from "react";
import { Navbar } from "@/src/components/ui/Navbar";
import { Footer } from "@/src/components/landing/Footer";
import { DashboardContainer } from "@/src/components/edit-profile/DashboardContainer";

// Importamos tus fetchers reales
import { getFields } from "@/src/data/fields/fields.data";
import { getServiceAreas } from "@/src/data/service-areas/sa.data";

export default async function UserDashboardPage() {
  // 1. Buscamos las listas reales en el servidor (Ejecución paralela)
  const [fields, serviceAreas] = await Promise.all([
    getFields(),
    getServiceAreas(),
  ]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-8 sm:py-12 grow">
        {/* 2. Inyectamos las opciones reales al contenedor */}
        <DashboardContainer
          availableFields={fields}
          availableAreas={serviceAreas}
        />
      </main>

      <Footer />
    </div>
  );
}
