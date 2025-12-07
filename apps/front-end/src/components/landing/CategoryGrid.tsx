import Link from "next/link";
import { Field } from "@tembiapo/db";
import FieldComponentButton from "../ui/FieldComponentButton";

async function getFields(): Promise<Field[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error("LA VARIABLE NEXT_PUBLIC_API_URL NO ESTÁ DEFINIDA");
    return [];
  }

  try {
    const res = await fetch(`${baseUrl}/fields`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error al obtener los rubros");
      return [];
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function CategoryGrid() {
  const fields = await getFields();

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-2xl justify-self-center font-bold mb-6 text-gray-900">
        Rubros Disponibles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {fields.map((field) => (
          <Link
            key={field.id}
            href={`/search?field=${field.id}`}
            className="block"
          >
            <FieldComponentButton {...field} />
          </Link>
        ))}
      </div>
    </section>
  );
}
