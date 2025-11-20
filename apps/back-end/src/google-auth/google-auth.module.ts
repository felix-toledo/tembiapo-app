import { Module } from '@nestjs/common';
import { GoogleAuthController } from './controller/google-auth.controller';
import { GoogleAuthService } from './services/google-auth.service';
import { HttpService } from '@nestjs/axios';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SIGNED_JWT'),
      }),
    }),
  ],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
})
export class GoogleAuthModule {}
