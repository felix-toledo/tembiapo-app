/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Field } from "@tembiapo/db";
import * as LucideIcons from "lucide-react";

export default function FieldComponentButton(cat: Field) {
  const IconComponent =
    (cat.lucide_icon && (LucideIcons as any)[cat.lucide_icon]) ||
    LucideIcons.HelpCircle;

  return (
    <div className="group bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-tierra-activa transition-all duration-300 flex flex-col items-center gap-4 cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95">
      <div className="p-3 bg-gray-300 group-hover:bg-tierra-activa group-hover:text-white rounded-lg transition-colors">
        <IconComponent size={32} />
      </div>
      <h3 className="font-semibold text-gray-900 group-hover:text-tierra-activa transition-colors">
        {cat.name}
      </h3>
    </div>
  );
}
