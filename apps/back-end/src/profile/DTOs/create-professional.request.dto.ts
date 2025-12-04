import { IsString, IsNotEmpty, Matches, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class Field {
  id: string;
  isMain: boolean;
}

export class ServiceArea {
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
  @Type(() => Field)
  fields: Field[];

  @IsArray()
  @IsNotEmpty()
  @Type(() => ServiceArea)
  serviceAreas: ServiceArea[];
}
