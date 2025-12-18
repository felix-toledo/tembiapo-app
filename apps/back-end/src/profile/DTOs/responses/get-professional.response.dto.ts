interface Area {
  id: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  isMain: boolean;
}

interface Field {
  id: string;
  name: string;
  isMain: boolean;
}

export class getProfessionalResponseDTO {
  professionalId: string;
  name: string;
  lastName: string;
  username: string;
  isVerified: boolean;
  isPremium: boolean;
  avatarURL: string;
  description: string;
  whatsappContact: string;
  area: Area[];
  fields: Field[];
}
