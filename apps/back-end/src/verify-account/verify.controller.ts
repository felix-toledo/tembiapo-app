/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
} from '@nestjs/common';
import { VerificationStatus } from '@tembiapo/db';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
// import { API_PREFIX } from '../app.controller';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { VerificationService } from './verify.service';
import { UploadedFiles } from '@nestjs/common';
import { API_PREFIX } from '../app.controller';

@Controller(`${API_PREFIX}/verify`)
export class VerifyController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PROFESSIONAL')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'dni', maxCount: 1 },
      { name: 'selfie', maxCount: 1 },
    ]),
  )
  create(
    @Req() req,
    @UploadedFiles()
    files: { dni?: Express.Multer.File[]; selfie?: Express.Multer.File[] },
  ) {
    const userId = req.user.userId as string;
    return this.verificationService.create(userId, files);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req) {
    const userId = req.user.userId as string;
    return this.verificationService.getVerificationStatus(userId);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.verificationService.findAll();
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: VerificationStatus,
  ) {
    return this.verificationService.updateStatus(id, status);
  }
}
