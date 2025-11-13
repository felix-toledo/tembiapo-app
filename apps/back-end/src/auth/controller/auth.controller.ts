import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterRequestDTO } from '../DTOs/register-request.dto';
import { JwtAuthGuard } from '../guards/auth/jwt-auth.guard';
import { LoginRequestDTO } from '../DTOs/login-request.dto';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('register')
    
    async register(@Body() registerDTO: RegisterRequestDTO) {
        return await this.authService.register(registerDTO);
    }

    @Post('login')
    //@UseGuards(JwtAuthGuard) ///Sirve para decirle a nest que esta ruta esta protegida, como es el login, no tiene que estar protegida
    async login(@Body() loginDTO : LoginRequestDTO){
        return await this.authService.login(loginDTO)
    }
}
