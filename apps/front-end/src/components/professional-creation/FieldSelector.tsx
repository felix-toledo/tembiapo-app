import { Field } from "@tembiapo/db";
import { cn } from "@/src/lib/utils";

interface FieldSelectorProps {
  fields: Field[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function FieldSelector({
  fields,
  selectedIds,
  onToggle,
}: FieldSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">Rubros disponibles</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {fields.map((field) => {
          const isSelected = selectedIds.includes(field.id);
          return (
            <button
              key={field.id}
              type="button"
              onClick={() => onToggle(field.id)}
              className={cn(
                "px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-parana-profundo",
                isSelected
                  ? "bg-parana-profundo text-white border-parana-profundo shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:border-parana-profundo hover:bg-gray-50"
              )}
            >
              {field.name}
            </button>
          );
        })}
      </div>
      {fields.length === 0 && (
        <p className="text-sm text-gray-500 italic text-center py-4">
          No hay rubros disponibles.
        </p>
      )}
    </div>
  );
}
