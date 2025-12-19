import { Controller, Get, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { GoogleAuthService } from '../services/google-auth.service';

import { API_PREFIX } from '../../app.controller';

///controller para el OAuth de google
@Controller(`${API_PREFIX}/google`)
export class GoogleAuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly configService: ConfigService,
  ) {}

  ///endpoint para el Callback de google
  @Get('callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    const frontUrl =
      this.configService.get<string>('FRONT_URL') || 'http://localhost:3000';

    try {
      ///guardamos el return del service
      const apiResponse =
        await this.googleAuthService.handleGoogleCallback(code);
      ///agarramos los atributos del data
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { accessToken, refreshToken } = apiResponse.data as any;

      ///creamos la cookie
      res.cookie('refresh-token', refreshToken, {
        // httpOnly: true,
        secure: false, //falso en desarrollo | true en produccion
        sameSite: 'strict', //proteccion contra CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, //duracion de 7 dias
      });

      ///redireccionamos al front con el access token
      return res.redirect(
        `${frontUrl}/google/callback?accessToken=${accessToken}`,
      );
    } catch (error) {
      ///Si hay un error, redireccionamos al front con el mensaje de error
      const errorMessage = encodeURIComponent(
        error instanceof Error
          ? error.message
          : 'Error en autenticación con Google',
      );
      return res.redirect(`${frontUrl}/google/callback?error=${errorMessage}`);
    }
  }
}
