/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Res,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

import { API_PREFIX } from '../../app.controller';
@Controller(`${API_PREFIX}/auth`)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('avatar'))
  async register(
    @Body() registerDTO: RegisterRequestDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.authService.register(registerDTO, file);
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
      // httpOnly: true, /// para que el frontend no la vea
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
      const errorResponse = createApiResponse(null, false, {
        message: 'No se encontro el refresh token en la cookie',
        code: 'NO_REFRESH_TOKEN',
      });
      return res.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    }

    ///llamamos al metodo de logout para invalidar el refresh token en DB
    const apiResponse = await this.authService.logout({ refreshToken });

    ///limpiamos la cookie
    res.clearCookie('refresh-token', {
      // httpOnly: true,
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

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh-token'];

    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: { message: 'No se encontró el refresh token' },
      });
    }

    try {
      const apiResponse =
        await this.authService.refreshAccessToken(refreshToken);
      return res.json(apiResponse);
    } catch {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: { message: 'El refresh token es inválido o ha expirado' },
      });
    }
  }
}
