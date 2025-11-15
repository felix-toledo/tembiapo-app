
import { Body, Controller, Post, HttpStatus, HttpCode, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterRequestDTO } from '../DTOs/register-request.dto';
import { LoginRequestDTO } from '../DTOs/login-request.dto';
import { createApiResponse } from '../../shared/utils/api-response.factory';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDTO: RegisterRequestDTO) {
    return await this.authService.register(registerDTO);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDTO: LoginRequestDTO, @Res({passthrough: true}) res: Response) { /// importamos el import de express para crear la cookie
    const apiResponse = await this.authService.login(loginDTO);
    const {message, accessToken, refreshToken} = apiResponse.data as any ///agarramos los campos de la api response y los manejamos con any

    res.cookie('refresh-token', refreshToken ,{ ///creamos la cookie
      httpOnly: true, /// para que el frontend no la vea
      secure: false, //Ponemos true en produccion | false en desarrollo
      sameSite: 'strict', // proteccion contra CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, //duracion de 7 dias
    });
    return createApiResponse({ ///retornamos la respuesta de la API
      message: message, ///mostramos el mensaje
      accessToken: accessToken, ///devolvemos el access token para que el front lo maneje
    },true); /// marcamos el success como true
  }
}
