import { CheckCircle, Shield, HeartHandshakeIcon, MapPin } from "lucide-react";
import Image from "next/image";
import { getFields } from "@/src/data/fields/fields.data";
import { getRandomElement } from "@/src/lib/utils";
import { HeroSearchForm } from "./HeroSearchForm";
// 1. Importamos el nuevo componente
import { HeroTitle } from "./HeroTitle";
import { InstallPWAButton } from "./InstallPWAButton";

export async function HeroSection() {
  const fields = await getFields();

  const heroImages = ["/hero_image_1.png", "/hero_image_2.png"];
  const selectedImage = getRandomElement(heroImages);

  return (
    <section className="relative w-full min-h-[85vh] md:min-h-[650px] flex flex-col items-center justify-center overflow-visible">
      {/* --- CAPA 0: IMAGEN DE FONDO --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src={selectedImage}
          alt="Profesional trabajando"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* --- CAPA 1: OSCURECIMIENTO --- */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* --- CAPA 2: CONTENIDO --- */}
      <div className="relative z-30 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center gap-6 py-12">
        {/* Badge superior */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-2 shadow-lg">
          <MapPin size={14} className="text-[#E35205]" />
          <span>La red de expertos del NEA</span>
        </div>

        {/* 2. Reemplazamos el H1 estático por el componente dinámico */}
        {/* Quitamos las clases de animación de entrada aquí porque el componente interno ya maneja su propia animación */}
        <HeroTitle />

        <p className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 text-gray-100 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
          Conectamos tus necesidades con los profesionales mejor calificados de
          tu ciudad. Rápido, seguro y garantizado.
        </p>

        {/* Buscador */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 w-full flex justify-center relative z-50">
          <HeroSearchForm fields={fields} />
        </div>

        {/* Botón de Instalación PWA (Solo Mobile) */}
        <InstallPWAButton />

        {/* Badges de confianza */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 flex flex-wrap justify-center gap-4 mt-8 w-full relative z-40">
          <GlassBadge
            icon={<Shield className="w-5 h-5 text-blue-400" />}
            title="Identidad Verificada"
          />
          <GlassBadge
            icon={<CheckCircle className="w-5 h-5 text-green-400" />}
            title="Garantía de Servicio"
          />
          <GlassBadge
            icon={<HeartHandshakeIcon className="w-5 h-5 text-tierra-activa" />}
            title="Confianza"
          />
        </div>
      </div>
    </section>
  );
}

function GlassBadge({ icon, title }: { icon: React.ReactNode; title: string }) {
  // ... (Este componente sigue igual)
  return (
    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl shadow-lg hover:bg-black/60 transition-all cursor-default group">
      <div className="group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span className="text-sm font-medium text-white tracking-wide shadow-black drop-shadow-sm">
        {title}
      </span>
    </div>
  );
}
