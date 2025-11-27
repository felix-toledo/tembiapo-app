import {  ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs'
///================REPOSITORIOS=================
import { professionalRepository } from '../repository/professional.repository';
import { UserRepository } from '../../auth/repository/user.repository';
///============================DTOs===========================
import { updateProfileRequestDTO } from '../DTOs/request/update-profile.request.dto';
import { updateProfileResponseDTO } from '../DTOs/responses/update-profile.response.dto';
import { createProfessionalRequestDTO } from '../DTOs/request/create-professional.request.dto';
import { createProfessionalResponseDTO } from '../DTOs/responses/create-professional.response.dto';
import { updatePictureResponseDTO } from '../DTOs/responses/update-picture.response.dto';
///==================SERVICIOS========================
import { RoleService } from '../../auth/services/role.service';

///=====================ENTIDADES===================
import { Professional, User } from '@tembiapo/db';
import { createApiResponse } from '../../shared/utils/api-response.factory';
import { ApiResponse } from '@tembiapo/types';

@Injectable()
export class ProfileService {

    constructor(private professionalRepository : professionalRepository, 
        private userRepository : UserRepository, 
        private roleService : RoleService){}




    ///=============METODO PARA CREAR LA CUENTA DE PROFESIONAL=================
    async createProfessionalProfile(id : string, createProfessionalProfile : createProfessionalRequestDTO) : Promise<ApiResponse<createProfessionalResponseDTO>>{

    
        let doesTheUserHaveAprofessionalProfile : Professional | null = await this.professionalRepository.getProfessionalByUserId(id)

        if(doesTheUserHaveAprofessionalProfile){
            throw new ConflictException("El usuario ya cuenta con un perfil profesional")
        }
        
        /// si existe el usuario y no tiene cuenta de profesional, creamos su cuenta
        let newProfessional : Professional = await this.professionalRepository.createProfessional(id,createProfessionalProfile)

        if(newProfessional){
          const  data : createProfessionalResponseDTO = {
                message : "Profesional creado exitosamente!"
            }
            return createApiResponse(data,true)
        }else {
            throw new ConflictException("Hubo un error a la hora de crear el profesional, por favor intente nuevamente mas tarde")
        }

    }


    ///=============METODO PARA ACTUALIZAR LA BIOGRAFIA Y NUMERO DE CONTACTO DEL PROFESIONAL

    async updateProfile(id : string,updateProfileRequest : updateProfileRequestDTO) : Promise<ApiResponse<updateProfileResponseDTO>>{
        let user : User | null = await this.userRepository.findById(id)

        if(!user){
            throw new NotFoundException("No existe ningun usuario asociado a ese ID")
        }

        const userRole  = await this.roleService.findById(user.roleId)

        if(userRole.name != 'PROFESSIONAL'){
            throw new UnauthorizedException("No cuenta con los permisos suficientes para navegar a esta ruta")
        }

       let professionalToBeUpdated : Professional | null = await this.professionalRepository.getProfessionalByUserId(id)

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


    async updatePicture(id : string, avatarPath : string ) : Promise<ApiResponse<updatePictureResponseDTO>>{

    let userToBeUpdated : User | null = await this.userRepository.findById(id)

    if(!userToBeUpdated){
        throw new NotFoundException("Usuario no encontrado mediante su ID")
    }
    
    // Guardamos la referencia a la url vieja en una variable auxiliar antes de actualizar
    const oldAvatarUrl = userToBeUpdated.avatarUrl;

    /// 1. Primero actualizamos la BD. Si esto falla, salta la excepción y NO borramos la foto vieja (seguridad).
    const result = await this.userRepository.updatePicture(id, avatarPath);

    /// 2. Si la BD se actualizó bien, procedemos a borrar la basura vieja
    if(result && oldAvatarUrl && !oldAvatarUrl.startsWith('http')){

        const relativePath = oldAvatarUrl.startsWith('/') ? oldAvatarUrl.slice(1) : oldAvatarUrl
        const absolutePath = join(process.cwd(), relativePath)

        try{
            if(fs.existsSync(absolutePath)){
                fs.unlinkSync(absolutePath); 
            }
        }catch(error){
            console.error('No se pudo borrar la imagen anterior: ', error)
        }
    }

    const data : updatePictureResponseDTO = {
        message: "Foto de perfil actualizada correctamente",
        url : avatarPath
    }

    return createApiResponse(data,true)
}
}
