import { IsString, Matches, IsArray } from 'class-validator';
import { Field, ServiceArea } from './create-professional.request.dto';

export class updateProfileRequestDTO {
  @IsString()
  biography: string;

  @IsString()
  @Matches(/^\d+$/, {
    message: 'El número de WhatsApp debe contener solo numeros.',
  })
  whatsappContact: string;

  @IsArray()
  fields: Field[];

  @IsArray()
  serviceAreas: ServiceArea[];
}
