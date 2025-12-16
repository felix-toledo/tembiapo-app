import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { VerifyController } from './verify.controller';
import { VerificationService } from './verify.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ConfigModule, HttpModule, CloudinaryModule, PrismaModule],
  controllers: [VerifyController],
  providers: [VerificationService],
  exports: [],
})
export class VerifyAccountModule {}
