import { Suspense } from "react";
import { HeroSection } from "../src/components/landing/hero/HeroSection";
import { FeaturedProsContainer } from "../src/components/landing/featured_pros/FeaturedProsContainer";
import { FeaturedProsSkeleton } from "../src/components/landing/featured_pros/FeaturedProsSkeleton";
import { cookies } from "next/headers";

import { Navbar } from "../src/components/ui/Navbar";
import { Footer } from "@/src/components/landing/Footer";
import { Trust } from "@/src/components/landing/Trust";
import { fetchServiceAreas, fetchFields } from "@/src/services/landing.service";

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.searchParams;
  const [areas, fields] = await Promise.all([
    fetchServiceAreas(),
    fetchFields(),
  ]);

  const suspenseKey = JSON.stringify(params);

  const cookieStore = await cookies();
  // const refreshToken = cookieStore.get("refresh-token");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Tembiapó",
    url: "https://tembiapo.app",
    logo: "https://tembiapo.app/imagotipo.png",
    image: "https://tembiapo.app/og_image.png",
    description:
      "Encontrá profesionales de confianza en el NEA. La plataforma líder para encontrar y contratar profesionales calificados.",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: "-27.4692",
        longitude: "-58.8306",
      },
      geoRadius: "500000",
      description: "NEA, Argentina",
    },
    priceRange: "$$",
    telephone: "+54-9-3794-000000",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Corrientes",
      addressCountry: "AR",
    },
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
