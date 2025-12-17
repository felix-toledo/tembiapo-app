import { IsString, Matches, IsArray, IsOptional } from 'class-validator';
import { Field, ServiceArea } from './create-professional.request.dto';

export class updateProfileRequestDTO {
  @IsString()
  @IsOptional()
  biography?: string;

  @IsString()
  @Matches(/^\d+$/, {
    message: 'El número de WhatsApp debe contener solo numeros.',
  })
  @IsOptional()
  whatsappContact?: string;

  @IsArray()
  @IsOptional()
  fields?: Field[];

  @IsArray()
  @IsOptional()
  serviceAreas?: ServiceArea[];
}
