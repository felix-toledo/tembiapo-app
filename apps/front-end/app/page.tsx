import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { CategoryGrid } from '../components/landing/CategoryGrid';
import { FeaturedPros } from '../components/landing/FeaturedPros';

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Contenedor principal para dar márgenes consistentes */}
      <div className="grow">
        <HeroSection />
        <CategoryGrid />
        <FeaturedPros />
      </div>
    </main>
  );
}