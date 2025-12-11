// Importamos los tipos originales generados por Prisma
import type { 
  Field as DBField, 
  ServiceArea as DBServiceArea, 
  VerificationStatus 
} from '@tembiapo/db';

// --- 1. MODELOS DE UI (Lo que usan tus componentes) ---

// Extendemos el Field de la BDD para agregarle 'isMain' (que viene de la tabla intermedia)
export interface UIField extends DBField {
  isMain: boolean;
}

// Extendemos el Area de la BDD para agregarle 'isMain'
export interface UIServiceArea extends DBServiceArea {
  isMain: boolean;
}

// Este es tu "DTO" principal para las tarjetas.
// NO es igual al modelo 'Professional' de la BDD, es una versión "aplanada" y limpia.
export interface ProfessionalCardProps {
  userId: string;
  professionalId: string; // ID de la tabla Professional
  
  // Datos Personales (Aplanados desde Person)
  name: string;
  lastName: string;
  username: string;
  avatarURL: string | null;
  isVerified: boolean;
  
  // Datos Profesionales
  description: string | null;
  whatsappContact: string;
  rating: number; // Calculado en el front por ahora

  // Relaciones con la propiedad extra 'isMain'
  fields: UIField[];
  area: UIServiceArea[];
}

// --- 2. RESPUESTAS DE API (Estructura de red) ---

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  data: T;
  success: boolean;
}