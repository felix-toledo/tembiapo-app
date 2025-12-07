import { Search, CheckCircle, Shield, Star } from "lucide-react";
import { getFields } from "@/src/data/fields/fields.data";
import { FieldsSearcher } from "./FieldsSearcher";
import OurButton from "../ui/OurButton";

export async function HeroSection() {
  const fields = await getFields();

  return (
    <section
      className="relative h-screen max-h-[600px] md:max-h-[700px] bg-cover bg-center flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url(/hero_image_2.png)",
        backgroundAttachment: "fixed",
        filter: "brightness(0.8)",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center flex flex-col items-center justify-center gap-8 h-full">
        {/* Headline */}
        <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-balance">
          Tu casa es sagrada. Encontrá profesionales de confianza y verificados
          en el NEA.
        </h1>

        {/* Search Bar */}
        <div className="w-full flex gap-2 bg-white rounded-xl p-2 shadow-lg items-center">
          <div className="flex-1">
            <FieldsSearcher fields={fields} />
          </div>
          <div className="w-auto md:w-48">
            <OurButton>
              <Search size={20} />
              <span>Buscar</span>
            </OurButton>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-6">
          <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full">
            <CheckCircle size={18} className="text-green-600" />
            <span className="text-sm font-medium text-gray-800">
              Identidad Validada
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full">
            <Shield size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-800">
              Vecinos de tu ciudad
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full">
            <Star size={18} className="text-yellow-500" />
            <span className="text-sm font-medium text-gray-800">
              Reseñas Reales
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
