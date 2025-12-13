"use client";

import { useAuth } from "@/src/context/AuthContext";
import { redirect } from "next/navigation";
import { CreateProfessionalForm } from "./CreateProfessionalForm";
import { Field, ServiceArea } from "@tembiapo/db";
import { Navbar } from "../ui/Navbar";
import { Footer } from "../landing/Footer";

interface CreateProfessionalClientProps {
  fields: Field[];
  serviceAreas: ServiceArea[];
}

export function CreateProfessionalClient({
  fields,
  serviceAreas,
}: CreateProfessionalClientProps) {
  const { user, professional } = useAuth();

  if (!user || user.role.toUpperCase() !== "PROFESSIONAL" || professional) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <CreateProfessionalForm fields={fields} serviceAreas={serviceAreas} />
      </main>
      <Footer />
    </div>
  );
}
