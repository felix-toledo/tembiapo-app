// apps/front-end/src/services/landing.service.ts

import { Professional, PaginationData, ApiSuccessResponse } from '../../types';
import { ServiceArea, Field } from '@tembiapo/db';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Definimos qué necesita la Home para funcionar
interface LandingPageData {
  professionals: Professional[];
  pagination: PaginationData;
  areas: ServiceArea[];
  title: string;
}

// --- LOGICA PRIVADA DE FETCHING (No se exporta) ---

async function fetchProfessionals(filters: { [key: string]: string | string[] | undefined }) {
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

async function fetchServiceAreas(): Promise<ServiceArea[]> {
  try {
    const res = await fetch(`${API_URL}/service-areas`, { cache: 'no-store' });
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

async function fetchFields(): Promise<Field[]> {
  try {
    const res = await fetch(`${API_URL}/fields`, { cache: 'no-store' });
    return res.ok ? await res.json() : [];
  } catch { return []; }
}

// --- LOGICA DE NEGOCIO (Calcular Título) ---
function getSectionTitle(filters: { [key: string]: string | string[] | undefined }, fields: Field[]): string {
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

// --- FUNCIÓN PÚBLICA (La única que llama la Page) ---
export async function getLandingData(searchParams: { [key: string]: string | string[] | undefined }): Promise<LandingPageData> {
  // Ejecutamos todo en paralelo
  const [professionalsData, areasData, fieldsData] = await Promise.all([
    fetchProfessionals(searchParams),
    fetchServiceAreas(),
    fetchFields()
  ]);

  return {
    professionals: professionalsData?.professionals || [],
    pagination: professionalsData?.pagination || { page: 1, totalPages: 1, limit: 8, total: 0 },
    areas: areasData,
    // Calculamos el título aquí dentro para no ensuciar la vista
    title: getSectionTitle(searchParams, fieldsData) 
  };
}