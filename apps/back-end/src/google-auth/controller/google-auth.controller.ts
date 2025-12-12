import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { GoogleAuthService } from '../services/google-auth.service';

import { API_PREFIX } from '../../app.controller';

///controller para el OAuth de google
@Controller(`${API_PREFIX}/google`)
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  ///endpoint para el Callback de google
  @Get('callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    ///guardamos el return del service
    const apiResponse = await this.googleAuthService.handleGoogleCallback(code);
    ///agarramos los atributos del data
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { message, accessToken, refreshToken } = apiResponse.data as any;

    ///creamos la cookie
    res.cookie('refresh-token', refreshToken, {
      httpOnly: true,
      secure: false, //falso en desarrollo | true en produccion
      sameSite: 'strict', //proteccion contra CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, //duracion de 7 dias
    });

    res.send(`
        <div style="font-family: Arial; background: #f9f9f9; padding: 2rem; border-radius: 8px; max-width: 600px; margin: 2rem auto;">
            <h2 style="color: #2e7d32;">¡Login con Google exitoso!</h2>
            <p><strong>Mensaje:</strong> ${message}</p>
            <p><strong>Access Token:</strong></p>
            <textarea style="width:100%;height:60px">${accessToken}</textarea>
            <p><strong>Refresh Token (cookie):</strong></p>
            <textarea style="width:100%;height:60px">${refreshToken}</textarea>
            <hr>
            <small style="color: #888;">Vista temporal para pruebas. ¡Saludos desde Perú 🇵🇪!</small>
        </div>
    `);

    //    return createApiResponse({ ///fix(auth): devolvemos la response asi muestra el mensaje si el email ya se encuentra en uso o no ya que si devolvemos con res.json debemos manejar los errores manualmente
    //     message: message,
    //     accessToken: accessToken,
    //    },true)
    /*el front una vez que se retorne el api response, deben agarrar el access token y el mensaje 
        y manejarlo como quieran (les recomiendo investigar como guardar el access token en una variable de ts para proteccion XSS, si no se quieren enrroscar, guardenlo en localstorage)
        y el mensaje lo podemos manejar con toasts para que se vea bonito y redireccionar al usuario al dashboard (el back ya crea el refresh token en la cookie)*/
  }
}
