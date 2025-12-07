import { Navbar } from "../src/components/landing/Navbar";
import { HeroSection } from "../src/components/landing/HeroSection";
import { CategoryGrid } from "../src/components/landing/CategoryGrid";
import { FeaturedPros } from "../src/components/landing/FeaturedPros";
import { Footer } from "@/src/components/landing/Footer";
import { Trust } from "@/src/components/landing/Trust";
export default function Home() {
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
