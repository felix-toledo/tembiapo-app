"use client";

import { Navbar } from "@/src/components/ui/Navbar";
import { Footer } from "@/src/components/landing/Footer";
import { ForgotPasswordForm } from "@/src/components/forgot-password/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-primary">
      <Navbar wantButtons={false} />
      <div className="grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <ForgotPasswordForm />
      </div>
      <Footer />
    </main>
  );
}
