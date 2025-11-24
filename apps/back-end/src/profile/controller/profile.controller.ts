import { Body, Controller, HttpCode, HttpStatus, Put, Req, UseGuards } from '@nestjs/common';
import { updateProfileRequestDTO } from '../DTOs/update-profile.request.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/role.guard';
import { Roles } from '../../shared/decorators/role.decorator';
import { ProfileService } from '../services/profile.service';


@Controller('api/profile')
export class ProfileController {

    constructor(private profileService : ProfileService){}

    @Put('me')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('PROFESSIONAL')
    @HttpCode(HttpStatus.OK)
    async updateProfile(@Body() updateProfileRequest : updateProfileRequestDTO, @Req() req){
        const userId = req.user.userId
        return await this.profileService.updateProfile(userId,updateProfileRequest)
    }
}
