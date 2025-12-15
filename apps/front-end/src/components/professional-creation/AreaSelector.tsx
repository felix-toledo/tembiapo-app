import { ServiceArea } from "@tembiapo/db";
import { cn } from "@/src/lib/utils";

interface AreaSelectorProps {
  serviceAreas: ServiceArea[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function AreaSelector({
  serviceAreas,
  selectedIds,
  onToggle,
}: AreaSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700">
        Áreas de cobertura disponibles
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {serviceAreas.map((area) => {
          const isSelected = selectedIds.includes(area.id);
          return (
            <button
              key={area.id}
              type="button"
              onClick={() => onToggle(area.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-1 focus:ring-parana-profundo",
                isSelected
                  ? "bg-parana-profundo text-white border-parana-profundo shadow-md transform scale-[1.02]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-parana-profundo hover:bg-gray-50"
              )}
            >
              <span className="font-semibold text-sm">{area.city}</span>
              <span
                className={cn(
                  "text-xs mt-1",
                  isSelected ? "text-blue-100" : "text-gray-400"
                )}
              >
                {area.province}
              </span>
            </button>
          );
        })}
      </div>
      {serviceAreas.length === 0 && (
        <p className="text-sm text-gray-500 italic text-center py-4">
          No hay áreas disponibles por el momento.
        </p>
      )}
    </div>
  );
}
