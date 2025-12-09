import { Search, CheckCircle, Shield, Star } from "lucide-react";
import Image from "next/image";
import { getFields } from "@/src/data/fields/fields.data";
import { FieldsSearcher } from "./FieldsSearcher";
import OurButton from "../ui/OurButton";

export async function HeroSection() {
  const fields = await getFields();

  return (
    <section className="relative w-full min-h-[85vh] md:min-h-[600px] flex flex-col items-center justify-center overflow-hidden">

      {/* --- CAPA 0: LA BASE (Imagen) --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero_image_2.png"
          alt="Profesional trabajando"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* --- CAPA 1: EL TINTE (Overlay) --- */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* --- CAPA 2: EL CONTENIDO (Texto y Botones) --- */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-center gap-8 md:gap-10 py-12">

        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-balance drop-shadow-md">
          Tu casa es sagrada. <br className="hidden md:block" />
          <span className="text-gray-200">Encontrá profesionales de confianza</span>
        </h1>

        <p className="text-gray-200 text-base sm:text-lg max-w-xl mx-auto md:hidden">
          Carpinteros, electricistas y más, validados por tu comunidad.
        </p>

        <div className="w-full max-w-2xl bg-white rounded-2xl p-3 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <FieldsSearcher fields={fields} />
          </div>
          <div className="w-full sm:w-auto min-w-[140px]">
            <OurButton className="w-full justify-center">
              <Search size={20} className="mr-2" />
              <span>Buscar</span>
            </OurButton>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 w-full">
          <Badge icon={<CheckCircle size={16} className="text-green-600" />} text="Identidad Validada" />
          <Badge icon={<Shield size={16} className="text-blue-600" />} text="Vecinos de tu ciudad" />
          <Badge icon={<Star size={16} className="text-yellow-500" />} text="Reseñas Reales" />
        </div>

      </div>
    </section>
  );
}

// Pequeño componente local para limpiar el código repetitivo de los badges
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm border border-gray-200/50">
      {icon}
      <span className="text-xs sm:text-sm font-semibold text-gray-800 whitespace-nowrap">
        {text}
      </span>
    </div>
  );
}