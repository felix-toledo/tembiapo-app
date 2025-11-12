// dto/register.dto.ts
import { IsEmail, IsString, MinLength, IsNotEmpty, Matches, IsOptional } from 'class-validator'; 
export class RegisterDto {
  // Datos de Persona
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @Matches(/^\d{8}$/, { message: 'DNI debe tener 8' })
  dni: string;

  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  // Datos de Usuario
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;


  // Datos opcionales de Professional
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  whatsappContact?: string;
}