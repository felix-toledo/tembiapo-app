//==================IMPORTS GENERALES==================
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from '@tembiapo/types';

//===================REPOSITORIOS========================
import { PersonRepository } from '../repository/person.repository';
import { UserRepository } from '../repository/user.repository';

//================SERVICIOS=================
import { RoleService } from './role.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
//===================DTOs====================
import { createApiResponse } from '../../shared/utils/api-response.factory';
import { RegisterRequestDTO } from '../DTOs/register-request.dto';
import { LoginResponseDTO } from '../DTOs/responses/login-response.dto';
import { LoginRequestDTO } from '../DTOs/login-request.dto';
import { RegisterResponseData } from '../DTOs/responses/register-response.dto';

//==========ENTIDADES=============
import { User } from '@tembiapo/db';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private personRepository: PersonRepository,
    private userRepository: UserRepository,
    private roleService: RoleService,
    private jwtService: JwtService,
  ) {}

  async register(
    register: RegisterRequestDTO,
  ): Promise<ApiResponse<RegisterResponseData | null>> {
    if (register === null) {
      throw new BadRequestException('No se encontro un DTO en la request');
    }

    ///1. verificamos primero que el email no exista
    const emailExists = await this.userRepository.isEmailExists(register.email);
    if (emailExists) {
      throw new ConflictException('El email ya se encuentra en uso');
    }

    ///2. verificamos que el username no exista
    const usernameExists = await this.userRepository.isUsernameExists(
      register.username,
    );

    if (usernameExists) {
      throw new ConflictException('El nombre de usuario no esta disponible');
    }

    ///3. verificamos que el dni no exista
    const dniExists = await this.personRepository.isDniExists(register.dni);

    if (dniExists) {
      throw new ConflictException('El DNI no se encuentra disponible');
    }

    ///4. Verificamos primero que las passwords coincidan
    if (register.password != register.confirmPassword) {
      throw new ConflictException('Las contraseñas no coinciden');
    }

    ///5. Si coinciden, hasheamos la password
    const hashedPassword = await bcrypt.hash(register.password, 10);

    ///6. Obtenemos el rol de profesional
    const proffesionalRole = await this.roleService.findByName('PROFESSIONAL');

    ///7. creamos una transaccion para crear el usuario y la persona asociada
    await this.prisma.$transaction(async (tx) => {
      ///creamos la persona primero
      const person = await tx.person.create({
        data: {
          name: register.name,
          lastName: register.lastName,
          dni: register.dni,
          contactPhone: register.contactPhone,
        },
      });

      ///creamos el usuario con la personID
      const user = await tx.user.create({
        data: {
          username: register.username,
          mail: register.email,
          password: hashedPassword, /// password hasehada
          roleId: proffesionalRole.id,
          personId: person.id,
        },
      });
      ///retornamos el person y user
      return { person, user };
    });

    /*aca como dijimos que va a devoler una Promise<RegisterResponse> seteamos que el success es true 
        y de data la response que creamos arriba
        (como la clase es async, en el controller la llamamos con await)
        */
    return createApiResponse({ message: 'Usuario registrado correctamente!' });
  }

  ///Funcion de inicio de sesion
  async login(
    loginRequest: LoginRequestDTO,
  ): Promise<ApiResponse<LoginResponseDTO | null>> {
    ///Utilice el patron factory function para los responses de la API

    ///Valida que la request no este vacia
    if (!loginRequest) {
      throw new BadRequestException('No se encontro un DTO en el body');
    }

    const user: User | null = await this.userRepository.findByEmail(
      loginRequest.email,
    ); ///Buscamos el usuario por el email que llego en la request (manejamos el caso de que sea null)

    if (!user) {
      throw new UnauthorizedException('El email o la contraseña es incorrecto');
    }
    const isMatch = await bcrypt.compare(loginRequest.password, user.password); ///Guardamos dentro de una variable si las passwords coinciden a la hora de hashearlas
    if (!isMatch) {
      throw new UnauthorizedException('El email o la contraseña es incorrecto');
    }

    const payload = { email: user.mail, sub: user.id }; ///Si pasa todas las validaciones, quiere decir que el inicio de sesion fue exitoso y creamos el payload del token utilizando el email y como subject el id del usuario

    const access_token = this.jwtService.sign(payload); ///Creamos el access token mediante el payload creado

    const data = {
      ///creamos la data que va a devolver el response si el inicio de sesion es exitoso
      message: 'Inicio de sesion exitoso!',
      accessToken: access_token,
    };

    return createApiResponse(data, true); ///Con el patron factory creamos el response de la API
  }
}
