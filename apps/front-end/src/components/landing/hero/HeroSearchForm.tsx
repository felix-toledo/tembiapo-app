"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SelectWithSearcher } from "../../ui/SelectWithSearcher";
import { Field } from "@tembiapo/db";
import { AutoScroll } from "@/src/lib/utils";

interface HeroSearchFormProps {
  fields: Field[];
}

export function HeroSearchForm({ fields }: HeroSearchFormProps) {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const handleSelectField = (field: Field) => {
    setSelectedField(field);

    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("field", field.id);

    router.push(`/?${params.toString()}#results`, { scroll: false });
    AutoScroll("results");
  };

  const handleClear = () => {
    setSelectedField(null);

    const params = new URLSearchParams(window.location.search);
    params.delete("field");

    // Si quieres resetear la página a 1 al borrar el filtro
    // params.set("page", "1");

    router.push(`/?${params.toString()}#results`, { scroll: false });
  };

  return (
    // CONTENEDOR PRINCIPAL
    // Ajuste: p-1.5 para que el botón quede más ajustado a los bordes
    <div className="group w-full max-w-3xl bg-white rounded-3xl sm:rounded-full p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex flex-col sm:flex-row items-center gap-2 transition-all duration-300 hover:shadow-[0_15px_35px_rgb(0,0,0,0.15)] hover:scale-[1.005]">
      {/* ZONA DEL INPUT */}
      <div className="flex-1 w-full flex items-center pl-4 pr-2 relative z-50 h-14">
        <div className="hidden sm:flex items-center justify-center text-gray-400 mr-3 pointer-events-none">
          <Search size={22} strokeWidth={2.5} />
        </div>

        <div className="w-full">
          <SelectWithSearcher
            data={fields}
            property="name"
            selectedItem={selectedField}
            setSelectedItem={handleSelectField}
            onClear={handleClear}
            placeholder="¿Qué servicio necesitas?"
            className="w-full border-none shadow-none focus:ring-0 bg-transparent text-lg text-gray-800 placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
}
