import React from 'react';
import { Navbar } from "@/src/components/ui/Navbar";
import { Footer } from "@/src/components/landing/Footer";
import { DashboardContainer } from '@/src/components/edit-profile/DashboardContainer';

export default function UserDashboardPage() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:py-12 grow">
        {/* Ya no pasamos mockData, el contenedor se encarga de buscar al usuario 'me' */}
        <DashboardContainer />
      </main>
      <Footer />
    </div>
  );
}