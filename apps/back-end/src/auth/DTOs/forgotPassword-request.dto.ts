import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class ForgotPasswordRequestDTO {
  ///validaciones para el email
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
