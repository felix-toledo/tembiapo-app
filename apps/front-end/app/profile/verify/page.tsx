"use client";
import { Navbar } from "@/src/components/ui/Navbar";
import { Footer } from "@/src/components/landing/Footer";
import { useAuth } from "@/src/context/AuthContext";
import { redirect } from "next/navigation";
import LoaderWaiter from "@/src/components/ui/loaders/LoaderWaiter";
import VerificationPageComponent from "@/src/components/profile/VerificationPageComponent";

export default function VerificationUpload() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <LoaderWaiter
        messages={["Cargando perfil...", "Consultando base de datos..."]}
      />
    );
  }

  if (!user) {
    redirect("/login");
  }

  if (user.isVerified) {
    redirect("/profile/" + (user.username || ""));
  }

  return (
    <div className="min-h-screen flex bg-gray-50 flex-col gap-4">
      <Navbar wantButtons={false} />
      <VerificationPageComponent />
      <Footer />
    </div>
  );
}
