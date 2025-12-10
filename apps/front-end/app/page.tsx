import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { Navbar } from "../src/components/ui/Navbar";
import { HeroSection } from "../src/components/landing/HeroSection";
import { CategoryGrid } from "../src/components/landing/CategoryGrid";
import { FeaturedPros } from "../src/components/landing/FeaturedPros";
import { Footer } from "@/src/components/landing/Footer";
import { Trust } from "@/src/components/landing/Trust";

export default async function Home() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh-token");

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      {/* Contenedor principal para dar márgenes consistentes */}
      <div className="grow">
        <HeroSection />
        <CategoryGrid />
        <FeaturedPros />
        <Trust />
        <Footer />
      </div>
    </main>
  );
}
