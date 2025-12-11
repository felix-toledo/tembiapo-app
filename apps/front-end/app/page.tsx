import { Suspense } from "react";
import { Navbar } from "../src/components/landing/Navbar";
import { HeroSection } from "../src/components/landing/hero/HeroSection";
import { FeaturedProsContainer } from "../src/components/landing/featured_pros/FeaturedProsContainer";
import { FeaturedProsSkeleton } from "../src/components/landing/featured_pros/FeaturedProsSkeleton";
import { Footer } from "@/src/components/landing/Footer";
import { Trust } from "@/src/components/landing/Trust";
import { fetchServiceAreas, fetchFields } from "@/src/services/landing.service";

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await props.searchParams;
  const [areas, fields] = await Promise.all([
    fetchServiceAreas(),
    fetchFields()
  ]);

  const suspenseKey = JSON.stringify(params);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="grow">
        <HeroSection />

        <Suspense key={suspenseKey} fallback={<FeaturedProsSkeleton />}>
          <FeaturedProsContainer 
             searchParams={params} 
             areas={areas} 
             fields={fields}
          />
        </Suspense>

        <Trust />
        <Footer />
      </div>
    </main>
  );
}