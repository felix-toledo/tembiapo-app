export function Footer() {
  return (
    <footer className="bg-[#3B5277] text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Para Clientes</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Buscar Profesionales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Cómo Funciona
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Para Profesionales</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Registrarse
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Verificación
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Contáctanos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Términos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-colors">
                  Seguridad
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <p className="text-sm mb-2">📧 soporte@tembiabo.app</p>
            <p className="text-sm">📍 Corrientes, Argentina</p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-sm text-white/80">
            Hecho con orgullo en Corrientes. © 2025 Tembiapó.
          </p>
        </div>
      </div>
    </footer>
  );
}
