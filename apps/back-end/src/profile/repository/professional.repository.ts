import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Professional } from "@tembiapo/db";
import { updateProfileRequestDTO } from "../DTOs/update-profile.request.dto";
import { createProfessionalRequestDTO } from "../DTOs/create-professional.request.dto";


@Injectable()
export class professionalRepository{

constructor(private prisma : PrismaService){}


async createProfessional(userId : string,createProfessionalProfile : createProfessionalRequestDTO) : Promise<Professional>{
    return await this.prisma.professional.create({
        data: {
            description: createProfessionalProfile.biography,
            whatsappContact: createProfessionalProfile.whatsappContact,
            createdAt: new Date(),
            userId: userId
        },
    });
}


///metodo para buscar un profesional por ID de usuario (este podemos buscarlo por el user id del JWT)
async getProfessionalByUserId(id : string) : Promise<Professional | null>{
    return await this.prisma.professional.findFirst({
        where: {userId: id}
    })
}

///metodo para actualizar la biografia y el numero de contacto
async updateProfile(id : string, updateProfileRequest: updateProfileRequestDTO) : Promise<boolean>{
    const result = await this.prisma.professional.updateMany({
        where: {id},
        data: {
            description: updateProfileRequest.biography,
            whatsappContact: updateProfileRequest.whatsappContact
        }
    });
    return result.count > 0;
}
    
}