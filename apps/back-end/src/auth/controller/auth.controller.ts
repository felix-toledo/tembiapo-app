import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../DTOs/register-request.dto';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('register')
    @HttpCode(200)
    async register(@Body() registerDTO: RegisterDto) {
        return await this.authService.register(registerDTO);
    }
}
