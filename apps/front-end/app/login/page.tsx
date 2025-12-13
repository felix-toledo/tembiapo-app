"use client";

import { Navbar } from "@/src/components/ui/Navbar";
import { Footer } from "@/src/components/landing/Footer";
import { LoginForm } from "@/src/components/login/LoginForm";
import { useAuth } from "@/src/context/AuthContext";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const { user } = useAuth();
  if (user) {
    redirect("/");
  }
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-primary">
      <Navbar wantButtons={false} />
      <div className="grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
      <Footer />
    </main>
  );
}
