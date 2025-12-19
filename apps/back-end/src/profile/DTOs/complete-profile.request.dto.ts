import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class CompleteProfileRequestDTO {
  @IsString()
  @MaxLength(11, { message: 'DNI debe tener máximo 11 caracteres' })
  @Matches(/^[0-9]+$/, { message: 'DNI debe contener solo números' })
  dni: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9._]+$/, {
    message:
      'Username solo puede contener letras, números, puntos y guiones bajos',
  })
  username?: string;
}
