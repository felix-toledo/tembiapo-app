import { IsEmail, IsEmpty, IsString, MinLength } from "class-validator";
export class LoginRequestDTO{
    ///validaciones para el email
@IsString()
@IsEmail()
@IsEmpty()
email : string


///validaciones para la password
@IsString()
@MinLength(6)

@IsEmpty()
password : string
}