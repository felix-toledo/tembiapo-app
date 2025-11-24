import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

///================REPOSITORIOS=================
import { professionalRepository } from '../repository/professional.repository';


///============================DTOs===========================
import { updateProfileRequestDTO } from '../DTOs/update-profile.request.dto';
import { updateProfileResponseDTO } from '../DTOs/responses/update-profile.response.dto';

///=====================ENTIDADES===================
import { Professional } from '@tembiapo/db';
import { createApiResponse } from '../../shared/utils/api-response.factory';
import { ApiResponse } from '@tembiapo/types';
@Injectable()
export class ProfileService {

    constructor(private professionalRepository : professionalRepository){}



    async updateProfile(id : string,updateProfileRequest : updateProfileRequestDTO) : Promise<ApiResponse<updateProfileResponseDTO>>{

       let professionalToBeUpdated : Professional | null = await this.professionalRepository.getProfessionalById(id)

        if(!professionalToBeUpdated){
            throw new NotFoundException("El ID no esta asociado a ningun profesional")
        }

        const result = await this.professionalRepository.updateProfile(professionalToBeUpdated.id, updateProfileRequest)

        if(!result){
            throw new ConflictException("Hubo un error a la hora de actualizar los datos, intente nuevamente en unos minutos.")
        }


        const data : updateProfileResponseDTO = {
            message: "Datos actualizados correctamente!"
        }


        return createApiResponse(data,true)
    }
}
