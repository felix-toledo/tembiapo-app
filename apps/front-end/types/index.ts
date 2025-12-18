// Importamos los tipos originales generados por Prisma
import type {
  Field as DBField,
  ServiceArea as DBServiceArea,
} from "@tembiapo/db";

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
  isPremium: boolean;

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

// --- 3. TYPES FOR PROFILE PAGE (DTOs del Service) ---

export interface PortfolioItem {
  id: string;
  title: string;
  field?: { 
    id: string; 
    name: string 
  };
  description: string | null;
  imageUrl: string;
}

export interface ProfessionalProfile {
  userId: string;
  professionalId: string;
  name: string;
  lastName: string;
  username: string;
  avatarURL: string | null;
  isVerified: boolean;
  isPremium: boolean;
  rating: number;
  description: string;
  whatsappContact: string;
  jobsCompleted: number;

  // Nota: Estas estructuras son un subset de UIField/UIServiceArea
  // porque el service hace un map manual y no devuelve todo el objeto de DB.
  fields: {
    id: string;
    name: string;
    isMain: boolean;
  }[];

  area: {
    id: string;
    city: string;
    province: string;
  }[];

  portfolio: PortfolioItem[];
}

// apps/front-end/types/index.ts
// Tipo principal que usan los componentes de perfil de usuario
export interface UserProfileData {
  professionalId: string;
  name: string;
  lastName: string;
  username: string;
  isVerified: boolean;
  isPremium: boolean;
  avatarURL: string | null; // Puede venir vacío según tu JSON
  description: string;
  whatsappContact: string;
  area: UIServiceArea[];
  fields: UIField[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// apps/front-end/src/types/portfolio.ts

export interface PortfolioImage {
  id: string;
  imageUrl: string;
  description: string;
  order: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  images: PortfolioImage[]; // Array de imágenes
}

export interface ProfessionalResponseDTO {
  professionalId: string;
  name: string;
  lastName: string;
  username: string;
  isVerified: boolean;
  isPremium: boolean;
  avatarURL: string | null;
  description: string;
  whatsappContact: string;
  area: UIServiceArea[];
  fields: UIField[];
}
