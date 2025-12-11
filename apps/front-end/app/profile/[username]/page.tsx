// apps/front-end/app/profile/[username]/page.tsx

import { getProfessionalProfile } from "@/src/services/profile.service";
import ProfilePageClient from "./ProfilePageClient"; // Separamos lógica cliente si la hubiera
import { notFound } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/src/components/landing/Navbar";
import { Footer } from "@/src/components/landing/Footer";
import OurButton from "@/src/components/ui/OurButton";
import { CheckCircle, Star, MapPin, Briefcase } from "lucide-react";

export default async function ProfilePage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  
  // Decodificamos por si el username tiene espacios o caracteres especiales
  const username = decodeURIComponent(params.username);
  
  const profile = await getProfessionalProfile(username);

  if (!profile) {
    notFound();
  }

  const mainField = profile.fields.find(f => f.isMain)?.name || profile.fields[0]?.name || "Profesional";
  const initials = `${profile.name?.[0] || ''}${profile.lastName?.[0] || ''}`;

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="grow container mx-auto px-4 py-8">
        
        {/* TARJETA PRINCIPAL (Igual que el diseño anterior pero con datos reales) */}
        <div className="border-2 border-black rounded-[3rem] bg-white overflow-hidden shadow-sm">
          
          <div className="bg-gray-50 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 border-b-2 border-gray-100">
            {/* AVATAR */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                {profile.avatarURL ? (
                  <Image src={profile.avatarURL} alt={profile.name} fill className="object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-gray-400">{initials}</span>
                )}
              </div>
              {profile.isVerified && (
                <div className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
                  <CheckCircle className="w-6 h-6 text-blue-500 fill-current" />
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {profile.name} {profile.lastName}
              </h1>
              <p className="text-xl text-gray-600 font-medium uppercase tracking-wide">
                {mainField}
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold text-gray-900">{profile.rating}</span>
                </div>
              </div>
            </div>

            {/* CTA WHATSAPP */}
            <div className="mt-4 md:mt-0">
              <a 
                href={`https://wa.me/${profile.whatsappContact?.replace(/\D/g,'')}`} // Limpia el número
                target="_blank" 
                rel="noopener noreferrer"
              >
                <OurButton 
                  frontColor="#25D366" 
                  outlineColor="#1DA851"
                  shadowColor="#128C7E"
                  textColor="white"
                >
                  Contactar por WhatsApp
                </OurButton>
              </a>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Sobre mí</h3>
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                  {profile.description}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    Zona de Cobertura
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.area.map((a: any) => (
                      <span key={a.id} className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                        {a.city}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Rubros */}
                <div>
                   <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    Especialidades
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.fields.map((f: any) => (
                      <span key={f.id} className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 border border-gray-200">
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* PORTFOLIO SECTION */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Trabajos Realizados</h3>
              {profile.portfolio.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.portfolio.map((item) => (
                    <div key={item.id} className="group relative rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="aspect-square relative bg-gray-100">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.title} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                      </div>
                      <div className="p-4 bg-white">
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic p-8 bg-gray-50 rounded-xl text-center border border-gray-100">
                   Este profesional aún no ha subido fotos de sus trabajos.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}