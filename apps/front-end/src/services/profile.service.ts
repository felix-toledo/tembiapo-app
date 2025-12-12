// apps/front-end/src/services/profile.service.ts
import { ProfessionalProfile, PortfolioItem } from "../../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper para rating (Mantenemos esto hasta que el backend tenga rating real)
function getFakeRating(id: string): number {
  const charCodeSum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ((charCodeSum % 11) + 40) / 10;
}

export async function getProfessionalProfile(username: string): Promise<ProfessionalProfile | null> {
  try {
    // 1. Fetch de Datos del Perfil
    const profileRes = await fetch(`${API_URL}/profile/${username}`, { cache: 'no-store' });
    
    if (!profileRes.ok) {
        if (profileRes.status === 404) return null; // Usuario no encontrado
        throw new Error('Error fetching profile');
    }
    
    const profileJson = await profileRes.json();
    const rawPro = profileJson.data; // Asumiendo estructura standard { data: ... }

    // 2. Fetch del Portafolio (En paralelo si es posible, o secuencial si depende de algo)
    // Tu endpoint es /api/v1/portfolio/{username}
    let portfolioItems: PortfolioItem[] = [];
    try {
        const portfolioRes = await fetch(`${API_URL}/portfolio/${username}`, { cache: 'no-store' });
        if (portfolioRes.ok) {
            const portfolioJson = await portfolioRes.json();
            // Mapeamos la respuesta del portafolio a nuestra interfaz
            // Asumo que portfolioJson.data es un array de items
            portfolioItems = portfolioJson.data.map((item: any) => ({
                id: item.id,
                title: item.title,
                description: item.description,
                // Tomamos la primera imagen si existe, o un placeholder
                imageUrl: item.images && item.images.length > 0 
                    ? item.images[0].imageUrl 
                    : "https://via.placeholder.com/400x400?text=Sin+Imagen" 
            }));
        }
    } catch (e) {
        console.warn("No se pudo cargar el portafolio", e);
    }

    // 3. Mapeo Final
    // La API /profile/{username} probablemente devuelva la estructura anidada User -> Person
    // O la estructura aplanada si ya implementaste el cambio en el backend.
    // Asumiré la estructura que me mostraste antes (anidada o semi-plana).
    
    // Ajusta este mapeo según lo que devuelva EXACTAMENTE tu endpoint /profile/{username}
    // Si devuelve User:
    const person = rawPro.person || {};
    const professional = rawPro.professional || {};

    return {
      userId: rawPro.id,
      professionalId: professional.id, 
      
      name: person.name,
      lastName: person.lastName,
      username: rawPro.username,
      avatarURL: rawPro.avatarUrl,
      isVerified: person.isVerified,
      rating: getFakeRating(professional.id || rawPro.id), // ID para semilla
      
      description: professional.description || "Sin descripción.",
      whatsappContact: professional.whatsappContact || "",
      jobsCompleted: 0, // Dato no disponible en API aún
      
      // Mapeo de relaciones
      fields: professional.fields ? professional.fields.map((f: any) => ({
          id: f.field.id,
          name: f.field.name,
          isMain: f.isMain
      })) : [],
      
      area: professional.serviceAreas ? professional.serviceAreas.map((a: any) => ({
          id: a.area.id,
          city: a.area.city,
          province: a.area.province
      })) : [],

      portfolio: portfolioItems
    };

  } catch (error) {
    console.error("Error en getProfessionalProfile:", error);
    return null;
  }
}