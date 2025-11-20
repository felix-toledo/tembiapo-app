import { Controller, Get, Query, Res } from '@nestjs/common';
import type {  Response } from 'express';
import { GoogleAuthService } from '../services/google-auth.service';

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

       return res.send(`<h1>¡Login con Google exitoso!</h1><pre>${JSON.stringify(apiResponse, null, 2)}</pre>`); ///mientras tanto, mostramos un mensaje de exito (luego redireccionar al dashboard)
        
    }

}
