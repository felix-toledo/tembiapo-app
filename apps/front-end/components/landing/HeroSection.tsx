import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center py-16 text-center space-y-6">
      <h1 className="text-5xl font-serif font-bold text-gray-900">
        TEMBIAPÓ
      </h1>
      <p className="text-xl text-gray-600 max-w-lg">
        Encontrá el profesional que estás buscando
      </p>

      {/* Search Bar Estilizada */}
      <div className="w-full max-w-2xl relative px-4">
        <div className="relative group">
          <input
            type="text"
            placeholder="Buscar (ej. Electricista, Plomero...)"
            className="w-full pl-10 pr-4 py-3 border border-gray-400 rounded-lg 
                       text-gray-900 placeholder:text-gray-500 font-medium
                       focus:ring-2 focus:ring-black focus:border-transparent 
                       outline-none shadow-sm transition-all bg-white"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>
    </section>
  );
}