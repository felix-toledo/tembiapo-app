import { IsString, IsNotEmpty, Matches } from "class-validator";

export class updateProfileRequestDTO{
   

    @IsString()
    biography : string

    @IsString()
    @IsNotEmpty()
    @Matches(/^\d+$/, { message: 'El número de WhatsApp debe contener solo numeros.' })
    whatsappContact : string
}