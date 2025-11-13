import { Body, Controller, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterRequestDTO } from '../DTOs/register-request.dto';
import { LoginRequestDTO } from '../DTOs/login-request.dto';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDTO: RegisterRequestDTO) {
        return await this.authService.register(registerDTO);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDTO : LoginRequestDTO){
        return await this.authService.login(loginDTO)
    }
}
