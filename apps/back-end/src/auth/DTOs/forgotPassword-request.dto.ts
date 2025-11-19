import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ForgotPasswordRequestDTO {
  ///validaciones para el email
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordRequestDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  confirmPassword: string;
}
