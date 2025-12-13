import { ServiceArea } from "@tembiapo/db";

export async function getServiceAreas(): Promise<ServiceArea[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    console.error("LA VARIABLE NEXT_PUBLIC_API_URL NO ESTÁ DEFINIDA");
    return [];
  }

  try {
    const res = await fetch(`${baseUrl}/service-areas`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Error al obtener los service areas");
      return [];
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
