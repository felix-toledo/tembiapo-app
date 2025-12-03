import { IsString, IsNotEmpty, Matches, IsArray } from 'class-validator';

export interface Field {
  id: string;
  isMain: boolean;
}

export interface ServiceArea {
  id: string;
  isMain: boolean;
}

export class createProfessionalRequestDTO {
  @IsString()
  biography: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, {
    message: 'El número de WhatsApp debe contener solo numeros.',
  })
  whatsappContact: string;

  @IsArray()
  @IsNotEmpty()
  fields: Field[];

  @IsArray()
  @IsNotEmpty()
  serviceAreas: ServiceArea[];
}
