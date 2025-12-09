import { Field } from "@tembiapo/db";

export async function getFields(): Promise<Field[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error("LA VARIABLE NEXT_PUBLIC_API_URL NO ESTÁ DEFINIDA");
    return [];
  }

  try {
    const res = await fetch(`${baseUrl}/api/v1/fields`, {
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
