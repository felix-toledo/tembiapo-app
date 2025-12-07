"use client";

import { useState } from "react";
import { SelectWithSearcher } from "../ui/SelectWithSearcher";

interface Field {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface FieldsSearcherProps {
  fields: Field[];
}

export function FieldsSearcher({ fields }: FieldsSearcherProps) {
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  return (
    <SelectWithSearcher
      data={fields}
      property="name"
      selectedItem={selectedField}
      setSelectedItem={setSelectedField}
      placeholder="Buscar Rubro"
    />
  );
}
