interface CategoryProps {
  name: string;
}

const CATEGORIES = [
  "Carpintero/a",
  "Mecánico/a",
  "Plomero/a",
  "Niñero/a",
  "Gasista",
  "Empleado/a Doméstico/a"
];

export function CategoryGrid() {
  return (
    <section className="py-10 container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className="group flex items-center justify-center py-6 px-4 bg-white border border-gray-400 rounded-xl shadow-sm hover:shadow-md hover:border-gray-400 hover:-translate-y-1 transition-all duration-200"
          >
            <span className="text-lg font-medium text-gray-700 group-hover:text-black">
              {cat}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}