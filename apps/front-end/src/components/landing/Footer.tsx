import { Instagram, Mail, MapPin, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#3B5277] text-white pt-16 pb-8 border-t-4 border-[#E35205]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Columna 1: Marca y Redes (Ocupa 2 espacios en pantallas grandes) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Tembiapó<span className="text-[#E35205]">.</span>
              </h2>
              <p className="mt-4 text-gray-300 leading-relaxed max-w-sm">
                Conectando el talento del NEA con quienes lo necesitan.
                Seguridad, rapidez y trato directo en una sola plataforma.
              </p>
            </div>

            {/* Redes Sociales */}
            <div className="flex space-x-4">
              {[Instagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E35205] hover:text-white transition-all duration-300 group"
                >
                  <Icon
                    size={20}
                    className="text-gray-300 group-hover:text-white"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 2: Clientes */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white border-b border-[#E35205] inline-block pb-2">
              Para clientes
            </h3>
            <ul className="space-y-4">
              {["Buscar Profesionales", "Garantía de Seguridad"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#E35205] hover:pl-2 transition-all duration-300 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Profesionales */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white border-b border-[#E35205] inline-block pb-2">
              Para profesionales
            </h3>
            <ul className="space-y-4">
              {[
                { title: "Unirse como Profesional", href: "/register" },
                { title: "Proceso de Verificación", href: "/register" },
                { title: "Centro de Ayuda", href: "/register" },
              ].map((item) => (
                <li key={item.title}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-[#E35205] hover:pl-2 transition-all duration-300 text-sm"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-white border-b border-[#E35205] inline-block pb-2">
              Contacto
            </h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#E35205] shrink-0" />
                <a
                  href="mailto:felixtoledoctes@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  soporte@tembiapo.app
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E35205] shrink-0" />
                <span>
                  Corrientes Capital,
                  <br />
                  Argentina
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {currentYear} Tembiapó. Todos los derechos reservados.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Términos
            </a>
            <span className="flex items-center gap-1 text-white/60">
              Hecho con{" "}
              <Heart size={14} className="text-[#E35205] fill-[#E35205]" /> en
              Corrientes
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
