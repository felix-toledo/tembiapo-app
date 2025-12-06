import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-gray-900">
          TEMBIAPÓ
        </Link>

        {/* Botones de Acción */}
        <div className="flex gap-4">
          <Link 
            href="/login" 
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/register" 
            className="px-4 py-2 text-sm font-medium text-white bg-black rounded hover:bg-gray-900 transition-colors shadow-sm"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
}