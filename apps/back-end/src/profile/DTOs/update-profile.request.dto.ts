import { IsString, IsNotEmpty } from "class-validator";

export class updateProfileRequestDTO{
   

    @IsString()
    @IsNotEmpty()
    biography : string

    @IsString()
    @IsNotEmpty()
    whatsappContact : string
}