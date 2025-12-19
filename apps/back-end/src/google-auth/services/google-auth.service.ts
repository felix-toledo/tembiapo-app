/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConflictException, Injectable } from '@nestjs/common';

import { firstValueFrom } from 'rxjs';

//==============SERVICIOS====================
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../prisma/prisma.service';
import { RoleService } from '../../auth/services/role.service';
//===============REPOSITORIOS===============
import { UserRepository } from '../../auth/repository/user.repository';
import { PersonRepository } from '../../auth/repository/person.repository';
import { RefreshTokenRepository } from '../../auth/repository/refresh-token.repository';
///================DTOs=================
import { GoogleRegisterDTO } from '../DTOs/google-register.dto';
import { GoogleResponseDTO } from '../DTOs/response/google-response.dto';
import { ApiResponse } from '@tembiapo/types';
import { createApiResponse } from '../../shared/utils/api-response.factory';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private userRepository: UserRepository,
    private prismaService: PrismaService,
    private roleService: RoleService,
    private personRepository: PersonRepository,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {}

  ///metodo para manejar el callback de google
  async handleGoogleCallback(
    code: string,
  ): Promise<ApiResponse<GoogleResponseDTO>> {
    ///esperamos el codigo que va a llegar por la URL que nos proporciona google
    const clientId = this.configService.get<string>('CLIENT_ID'); ///obtenemos el client-id del .env
    const clientSecret = this.configService.get<string>('SECRET_CLIENT'); ///Obtenemos el secret-client del .env
    const APIURL = process.env.BACK_URL || 'http://localhost:3001'; ///Obtenemos el api-url del .env
    const redirectUri = `${APIURL}/api/v1/google/callback`;

    // 1. Intercambiamos el código por un token
    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        ///hacemos una peticion HTTP post a la API de google
        'https://oauth2.googleapis.com/token',
        {
          code, ///le mandamos el codigo a intercambiar por un token
          client_id: clientId, ///el client-id
          client_secret: clientSecret, ///el secret-id
          redirect_uri: redirectUri, //la uri de redireccionamiento
          grant_type: 'authorization_code', ///el tipo de acceso
        },
        { headers: { 'Content-Type': 'application/j son' } }, /// y los headers principales para la peticion
      ),
    );

    // 2. Obtenemos el id_token de la respuesta
    const { id_token } = tokenResponse.data;

    // 3. Decodificamos el id_token
    const userData: any = this.jwtService.decode(id_token);

    // 4. Creamos el GoogleRegisterDTO
    const googleDTO: GoogleRegisterDTO = {
      name: userData.given_name,
      lastName: userData.family_name || '',
      email: userData.email,
      pictureUrl: userData.picture,
    };

    // 5. Buscamos el usuario por su email
    const userexists = await this.userRepository.findByEmail(googleDTO.email);
    if (userexists) {
      // si es true verificamos si OAuth es true
      if (userexists.isOauthUser) {
        /// si es true creamos los tokens y retornamos
        ///Obtenemos el rol del usuario que esta iniciando sesion para futuras protecciones
        const role = await this.roleService.findById(userexists.roleId);

        const payload = {
          sub: userexists.id,
          email: googleDTO.email,
          role: role.name,
        }; ///creamos el payload

        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' }); ///generamos el access token

        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); ///generamos el refresh token

        const expires = new Date(); ///creamos la fecha de expiracion

        expires.setDate(expires.getDate() + 7); /// le agregamos 7 dias para que coincida

        ///guardamos el refresh token en la db (este metodo sirve para reemplazar un refresh token si esta activo o revocado para el mismo user id asi no creamos uno nuevo mientras ya existe uno)
        await this.refreshTokenRepository.replaceRefreshToken(
          refreshToken,
          expires,
          userexists.id,
        );

        ///creamos la data a devolver
        const data: GoogleResponseDTO = {
          message: 'inicio de sesion exitoso',
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
        return createApiResponse(data, true); ///con factory function creamos la respuesta de la api
      } else {
        throw new ConflictException('El email ya se encuentra en uso'); /// si el usuario no es OAuth (es un registro tradicional) y usa un email que ya existe, debemos mostrar que el email ya existe
      }
    } else {
      /// si el usuario no existe con el email retornado por google, creamos el usuario y la persona (los datos faltantes los podemos pedir cuando este en el dashboard)
      const role = await this.roleService.findByName('PROFESSIONAL');
      const { user } = await this.prismaService.$transaction(async () => {
        const person = await this.personRepository.createPerson(
          googleDTO.name,
          googleDTO.lastName,
          '',
        );
        const user = await this.userRepository.createUser(
          '',
          googleDTO.email,
          googleDTO.pictureUrl,
          '',
          role.id,
          person.id,
          true,
        );
        return { user }; ///retornamos el user creado para poder crear sus tokens
      });

      const payload = { sub: user.id, email: googleDTO.email, role: role.name }; ///creamos el payload

      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' }); //generamos el access token

      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); ///creamos el refresh token

      const expires = new Date(); /// seteamos la expiracion
      expires.setDate(expires.getDate() + 7); ///le agregamos 7 dias

      await this.refreshTokenRepository.createRefreshToken(
        refreshToken,
        expires,
        user.id,
      ); // guardamos el refresh token en la DB

      const data: GoogleResponseDTO = {
        ///creamos el data a devolver
        message: 'inicio de sesion exitoso',
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      return createApiResponse(data, true); ///retornamos la respuesta de la API
    }
  }
}
