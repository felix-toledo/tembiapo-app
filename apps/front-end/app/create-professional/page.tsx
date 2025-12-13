import { CreateProfessionalClient } from "@/src/components/professional-creation/CreateProfessionalClient";
import { getFields } from "@/src/data/fields/fields.data";
import { getServiceAreas } from "@/src/data/service-areas/sa.data";

export default async function CreateProfesional() {
  const fields = await getFields();
  const serviceAreas = await getServiceAreas();

  return (
    <CreateProfessionalClient fields={fields} serviceAreas={serviceAreas} />
  );
}
