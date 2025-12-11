import { Professional, PaginationData, ApiSuccessResponse } from '../../types';
import { ServiceArea, Field } from '@tembiapo/db';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// --- 1. FETCH "LENTO" (Profesionales) ---
export async function fetchProfessionals(filters: { [key: string]: string | string[] | undefined }) {
  
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Retraso artificial de 3 segundos

  const params = new URLSearchParams();
  const page = typeof filters.page === 'string' ? filters.page : '1';
  
  params.append('page', page);
  params.append('limit', '8');
  if (typeof filters.field === 'string') params.append('field', filters.field);
  if (typeof filters.area === 'string') params.append('area', filters.area);
  if (typeof filters.isVerified === 'string') params.append('isVerified', filters.isVerified);
  if (typeof filters.q === 'string') params.append('username', filters.q); 

  try {
    const res = await fetch(`${API_URL}/profile/all-professionals?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json: ApiSuccessResponse<{ professionals: Professional[], pagination: PaginationData }> = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching professionals:", error);
    return null;
  }
}

// --- 2. FETCH RÁPIDO (Áreas de Servicio) ---
// Exportamos para que page.tsx lo llame directo y cargue rápido.
export async function fetchServiceAreas(): Promise<ServiceArea[]> {
  try {
    const res = await fetch(`${API_URL}/service-areas`, { cache: 'no-store' });
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

// --- 3. FETCH RÁPIDO (Rubros) ---
// Exportamos para que page.tsx lo llame directo.
export async function fetchFields(): Promise<Field[]> {
  try {
    const res = await fetch(`${API_URL}/fields`, { cache: 'no-store' });
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

// --- LOGICA DE NEGOCIO (Calcular Título) ---
export function getSectionTitle(filters: { [key: string]: string | string[] | undefined }, fields: Field[]): string {
  if (typeof filters.field === 'string' && fields.length > 0) {
    const selectedField = fields.find(f => f.id === filters.field);
    if (selectedField) return `Profesionales: ${selectedField.name}`;
  } 
  if (typeof filters.q === 'string' && filters.q) {
    return `Resultados para "${filters.q}"`;
  }
  if (filters.isVerified === 'true') {
    return "Profesionales Verificados";
  }
  return "Profesionales Mejor Valuados";
}

// --- HELPER OPCIONAL (Para datos iniciales rápidos) ---
// Si quieres limpiar page.tsx, puedes usar esto para traer SOLO lo rápido.
export async function getFastLandingData() {
  const [areas, fields] = await Promise.all([
    fetchServiceAreas(),
    fetchFields()
  ]);
  
  return { areas, fields };
}