import { ServiceArea } from "@tembiapo/db";

export function AreaSelector({
  setArea,
  serviceAreas,
}: {
  setArea: (area: string) => void;
  serviceAreas: ServiceArea[];
}) {
  return (
    <div>
      <h2>Area Selector</h2>
      {serviceAreas.map((serviceArea) => (
        <div key={serviceArea.id} onClick={() => setArea(serviceArea.city)}>
          {serviceArea.city}
        </div>
      ))}
    </div>
  );
}
