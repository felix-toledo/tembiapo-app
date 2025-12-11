import {
  ProfessionalCardProps,
  ApiSuccessResponse,
  PaginationData,
} from '../../types';

import type { ServiceArea, Field } from '@tembiapo/db';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// --- 1. FETCH DE PROFESIONALES (Principal) ---
export async function fetchProfessionals(filters: { [key: string]: string | string[] | undefined }) {
  
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Retraso artificial

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

    const json: ApiSuccessResponse<{ professionals: ProfessionalCardProps[], pagination: PaginationData }> = await res.json();
    
    return {
        professionals: json.data.professionals,
        pagination: json.data.pagination
    };

  } catch (error) {
    console.error("Error fetching professionals:", error);
    return null;
  }
}

// --- 2. FETCHS AUXILIARES (Rápidos) ---

export async function fetchServiceAreas(): Promise<ServiceArea[]> {
  try {
    const res = await fetch(`${API_URL}/service-areas`, { cache: 'no-store' });
    if (!res.ok) return [];
    // Asumiendo que este endpoint devuelve directamente { data: [...] } o [...]
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch { return []; }
}

export async function fetchFields(): Promise<Field[]> {
  try {
    const res = await fetch(`${API_URL}/fields`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch { return []; }
}

// --- LÓGICA DE UI ---

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