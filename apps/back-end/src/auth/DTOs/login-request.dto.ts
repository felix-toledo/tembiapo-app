import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
export class LoginRequestDTO{
    ///validaciones para el email
@IsString()
@IsEmail()
@IsNotEmpty()
email : string


///validaciones para la password
@IsString()
@MinLength(6)
@IsNotEmpty()
password : string
}