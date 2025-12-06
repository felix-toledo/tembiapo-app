export interface Field {
  id: string; // UUID
  name: string;
  isMain?: boolean;
}

export interface ServiceArea {
  id: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
}

export interface Professional {
  professionalId: string; // UUID
  name: string;
  lastName: string;
  username: string;
  avatarURL: string | null;
  description: string;
  whatsappContact: string;
  isVerified: boolean;
  rating?: number;

  // Relaciones
  area: ServiceArea[];
  fields: Field[];
}

export interface ProfessionalsResponse {
  data: {
    professionals: Professional[];
    pagination: PaginationData;
  };
  success: boolean;
}

// Estructura de paginación de tu API
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
