import { Navbar } from "../src/components/landing/Navbar";
import { HeroSection } from "../src/components/landing/HeroSection";
// import { CategoryGrid } from "../src/components/landing/CategoryGrid";
import { FeaturedPros } from "../src/components/landing/FeaturedPros";
import { Footer } from "@/src/components/landing/Footer";
import { Trust } from "@/src/components/landing/Trust";
import { getLandingData } from "@/src/services/landing.service"; 

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // 1. Resolvemos los parámetros (Next.js 15)
  const params = await props.searchParams;
  const { professionals, pagination, areas, title } = await getLandingData(params);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="grow">
        <HeroSection />
        {/* <CategoryGrid /> */}
        
        <FeaturedPros 
          title={title}
          professionals={professionals}
          pagination={pagination}
          areas={areas}
        />
        
        <Trust />
        <Footer />
      </div>
    </main>
  );
}