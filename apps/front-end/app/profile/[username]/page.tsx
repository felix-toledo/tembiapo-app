"use client";

import React, { use } from "react";
import Link from "next/link";
import { useFetch } from "@/src/hooks/useFetch";
import { UserProfileData } from "@/types";
import { UnverifiedProfileLayout } from "@/src/components/profile/UnverifiedProfileLayout";
import { Navbar } from "@/src/components/ui/Navbar";
import { Footer } from "@/src/components/landing/Footer";
import LoaderWaiter from "@/src/components/ui/loaders/LoaderWaiter";
import { VerifiedProfileLayout } from "@/src/components/profile/VerifiedProfileLayout";

// URL del Backend directo (Para cuando se arregle CORS)
// const DIRECT_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  // --- SELECCIÓN DE ESTRATEGIA DE FETCH ---

  // OPCIÓN A: MODO PROXY (Solución temporal para CORS)
  // Llamamos a nuestra propia API interna de Next.js
  const fetchUrl = `/api/auth/profile/${username}`;

  // OPCIÓN B: MODO DIRECTO (Ideal para producción con CORS arreglado)
  // const fetchUrl = `${DIRECT_API_URL}/profile/${username}`;

  // ----------------------------------------

  const { data, loading, error } = useFetch<UserProfileData>(fetchUrl);

  // Manejo de Estados
  if (loading) {
    return (
      <LoaderWaiter
        messages={["Buscando perfil...", "Consultando base de datos..."]}
      />
    );
  }

  // Validación robusta: Verificamos error o que data sea null
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <Navbar /> {/* Mantenemos navbar para no perder navegación */}
        <div className="flex flex-col items-center justify-center grow p-4 text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-2">Ups!</h1>
          <p className="text-xl font-semibold text-gray-800">
            No pudimos cargar el perfil
          </p>
          <p className="text-gray-500 max-w-md mt-2">
            {error
              ? `Detalle técnico: ${error}`
              : `No encontramos al usuario "${username}".`}
          </p>
          <Link
            href="/"
            className="mt-6 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-8 sm:py-12 grow">
        {data.isVerified ? (
          <VerifiedProfileLayout data={data} />
        ) : (
          <UnverifiedProfileLayout data={data} />
        )}
      </main>

      <Footer />
    </div>
  );
}
