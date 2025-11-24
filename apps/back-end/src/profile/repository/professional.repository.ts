import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Professional } from "@tembiapo/db";
import { updateProfileRequestDTO } from "../DTOs/update-profile.request.dto";


@Injectable()
export class professionalRepository{

constructor(private prisma : PrismaService){}




///metodo para buscar un profesional por ID (este podemos buscarlo por el user id del JWT)
async getProfessionalById(id : string) : Promise<Professional | null>{
    return await this.prisma.professional.findFirst({
        where: {id}
    })
}

async updateProfile(id : string, updateProfileRequest: updateProfileRequestDTO) : Promise<boolean>{
    const result = await this.prisma.professional.updateMany({
        where: {id},
        data: updateProfileRequest
    });
    return result.count > 0;
}
    
}