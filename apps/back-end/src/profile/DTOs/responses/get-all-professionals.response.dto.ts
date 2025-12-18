export interface ProfessionalItemDTO {
  professionalId: string;
  name: string;
  lastName: string;
  username: string;
  avatarURL: string;
  description: string;
  whatsappContact: string;
  isVerified: boolean;
  isPremium: boolean;
  area: Array<{
    id: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    isMain: boolean;
  }>;
  fields: Array<{
    id: string;
    name: string;
    isMain: boolean;
  }>;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAllProfessionalsResponseDTO {
  professionals: ProfessionalItemDTO[];
  pagination: PaginationMetadata;
}
