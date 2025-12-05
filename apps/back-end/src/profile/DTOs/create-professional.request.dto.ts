import {
  IsString,
  IsNotEmpty,
  Matches,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Field {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
  isMain: boolean;
}

export class ServiceArea {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsBoolean()
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
  @ValidateNested({ each: true })
  @Type(() => Field)
  fields: Field[];

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ServiceArea)
  serviceAreas: ServiceArea[];
}
