import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { API_PREFIX } from '../app.controller';

@ApiTags('Users')
@Controller(`${API_PREFIX}/users`)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId: string = req.user.userId as string;
    return await this.userService.getUserInfo(userId);
  }
}
