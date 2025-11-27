/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Res,
  Req,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterRequestDTO } from '../DTOs/register-request.dto';
import { LoginRequestDTO } from '../DTOs/login-request.dto';
import { createApiResponse } from '../../shared/utils/api-response.factory';
import { LoginResponseDTO } from '../DTOs/responses/login-response.dto';
import {
  ForgotPasswordRequestDTO,
  ResetPasswordRequestDTO,
} from '../DTOs/forgotPassword-request.dto';
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
  async login(
    @Body() loginDTO: LoginRequestDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    /// importamos el import de express para crear la cookie
    const apiResponse = await this.authService.login(loginDTO);
    const { message, accessToken, refreshToken } =
      apiResponse.data as LoginResponseDTO; ///agarramos los campos de la api response y los manejamos con any

    res.cookie('refresh-token', refreshToken, {
      ///creamos la cookie
      httpOnly: true, /// para que el frontend no la vea
      secure: false, //Ponemos true en produccion | false en desarrollo
      sameSite: 'strict', // proteccion contra CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, //duracion de 7 dias
    });
    return createApiResponse(
      {
        ///retornamos la respuesta de la API
        message: message, ///mostramos el mensaje
        accessToken: accessToken, ///devolvemos el access token para que el front lo maneje
      },
      true,
    ); /// marcamos el success como true
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    ///obtenemos el refresh token de la cookie

    const refreshToken = req.cookies['refresh-token'];

    //verificamos si el refresh token existe, si no existe devolvemos un error o un mensaje
    if (!refreshToken) {
      return createApiResponse(null, false, {
        message: 'No se encontro el refresh token en la cookie',
        code: 'NO_REFRESH_TOKEN',
      });
    }

    ///llamamos al metodo de logout para invalidar el refresh token en DB
    const apiResponse = await this.authService.logout({ refreshToken });

    ///limpiamos la cookie
    res.clearCookie('refresh-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });

    return res.json(apiResponse);
  }



  

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDTO: ForgotPasswordRequestDTO,
    @Res() res: Response,
  ) {
    const apiResponse =
      await this.authService.forgotPassword(forgotPasswordDTO);

    return res.json(apiResponse);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDTO: ResetPasswordRequestDTO,
    @Res() res: Response,
  ) {
    const apiResponse = await this.authService.resetPassword(resetPasswordDTO);
    return res.json(apiResponse);
  }
}
