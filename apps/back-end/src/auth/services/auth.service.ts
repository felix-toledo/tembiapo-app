import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PersonRepository } from '../repository/person.repository';
import { UserRepository } from '../repository/user.repository';
import { RegisterDto } from '../DTOs/register-request.dto';
import { RoleService } from './role.service';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterResponse ,RegisterResponseData } from '../DTOs/response/register-response.dto';
@Injectable()
export class AuthService {

    constructor(private prisma : PrismaService,private personRepository : PersonRepository, private userRepository : UserRepository, private roleService : RoleService){}


    async register(register : RegisterDto) : Promise<RegisterResponse>{

        if(register === null){
            throw new NotFoundException("No se encontro un DTO en la request")
        }
        
        ///1. verificamos primero que el email no exista
        const emailExists = await this.userRepository.isEmailExists(register.email)
        if(emailExists){
            throw new ConflictException("El email ya se encuentra en uso") 
        }


        ///2. verificamos que el username no exista
        const usernameExists = await this.userRepository.isUsernameExists(register.username)

        if(usernameExists){
            throw new ConflictException("El nombre de usuario no esta disponible")
        }

        ///3. verificamos que el dni no exista
        const dniExists = await this.personRepository.isDniExists(register.dni)

        if(dniExists){
            throw new ConflictException("El dni ya existe")
        }

        ///4. Verificamos primero que las passwords coincidan
        if(register.password != register.confirmPassword){
            throw new ConflictException("Las contraseñas no coinciden")
        }

        ///5. Si coinciden, hasheamos la password
        const hashedPassword = await bcrypt.hash(register.password,10)

        ///6. Obtenemos el rol de profesional
        const proffesionalRole = await this.roleService.findByName('PROFESSIONAL')

        ///7. creamos una transaccion para crear el usuario y la persona asociada
         await this.prisma.$transaction(async (tx) => {
            ///creamos la persona primero
            const person = await tx.person.create({
                data:{
                    name: register.name,
                    lastName: register.lastName,
                    dni: register.dni,
                    contactPhone: register.contactPhone
                },

            });

            ///creamos el usuario con la personID
            const user = await tx.user.create({
                data :{
                    username: register.username,
                    mail: register.email,
                    password: hashedPassword, /// password hasehada
                    roleId: proffesionalRole.id,
                    personId: person.id
                },
            });
            ///retornamos el person y user
            return {person, user}
        })
        ///si todo sale bien creamos la response de que el usuario fue registrado correctamente
        const response : RegisterResponseData = {
            message: "Usuario registrado correctamente!"
        }

        /*aca como dijimos que va a devoler una Promise<RegisterResponse> seteamos que el success es true 
        y de data la response que creamos arriba
        (como la clase es async, en el controller la llamamos con await)
        */
       return {
            success: true,
            data: response
        }


    }
}


