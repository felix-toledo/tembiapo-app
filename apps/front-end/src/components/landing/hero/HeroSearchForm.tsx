"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { SelectWithSearcher } from "../../ui/SelectWithSearcher";
import OurButton from "../../ui/OurButton";
import { Field } from "@tembiapo/db";
import { AutoScroll } from "@/src/lib/utils";

interface HeroSearchFormProps {
  fields: Field[];
}

export function HeroSearchForm({ fields }: HeroSearchFormProps) {
  const router = useRouter();
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const handleSearch = () => {
    if (!selectedField) return;

    // Construimos la URL
    const params = new URLSearchParams();
    params.set("page", "1"); // Reseteamos paginación
    params.set("field", selectedField.id); // Usamos el ID para filtrar

    router.push(`/?${params.toString()}#results`, { scroll: false });

    AutoScroll("results");
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl p-3 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      
      {/* EL BUSCADOR (Controlado por este componente) */}
      <div className="flex-1">
        <SelectWithSearcher
          data={fields}
          property="name"
          selectedItem={selectedField}
          setSelectedItem={setSelectedField}
          placeholder="Buscar Rubro (ej. Electricista)"
          className="z-50"
        />
      </div>

      {/* EL BOTÓN (Ahora sí sabe qué buscar) */}
      <div className="w-full sm:w-auto min-w-[140px]">
        <OurButton 
          className="w-full justify-center"
          onClick={handleSearch}
        >
          <Search size={20} className="mr-2" />
          <span>Buscar</span>
        </OurButton>
      </div>

    </div>
  );
}