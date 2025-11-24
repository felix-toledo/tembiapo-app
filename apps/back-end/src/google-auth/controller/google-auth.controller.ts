import { Controller, Get, Query, Res } from '@nestjs/common';
import type {  Response } from 'express';
import { GoogleAuthService } from '../services/google-auth.service';
import { createApiResponse } from '../../shared/utils/api-response.factory';

///controller para el OAuth de google
@Controller('v1/google')
export class GoogleAuthController {

    constructor(private readonly googleAuthService : GoogleAuthService){}

    ///endpoint para el Callback de google
    @Get('callback')
    async googleCallback(@Query('code') code : string, @Res() res : Response){
        ///guardamos el return del service
        const apiResponse = await this.googleAuthService.handleGoogleCallback(code)
        ///agarramos los atributos del data
        const {message, accessToken, refreshToken} = apiResponse.data as any

        ///creamos la cookie
        res.cookie('refresh-token', refreshToken, {
            httpOnly: true,
            secure: false, //falso en desarrollo | true en produccion
            sameSite: 'strict', //proteccion contra CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, //duracion de 7 dias
        });

       return createApiResponse({ ///fix(auth): devolvemos la response asi muestra el mensaje si el email ya se encuentra en uso o no ya que si devolvemos con res.json debemos manejar los errores manualmente
        message: message,
        accessToken: accessToken,
       },true)
        /*el front una vez que se retorne el api response, deben agarrar el access token y el mensaje 
        y manejarlo como quieran (les recomiendo investigar como guardar el access token en una variable de ts para proteccion XSS, si no se quieren enrroscar, guardenlo en localstorage)
        y el mensaje lo podemos manejar con toasts para que se vea bonito y redireccionar al usuario al dashboard (el back ya crea el refresh token en la cookie)*/
    }

}
