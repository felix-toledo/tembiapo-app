import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GoogleAuthModule } from './google-auth/google-auth.module';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ScheduleModule.forRoot(),
    SharedModule,
    ConfigModule.forRoot({
      ///Importamos el configModule para obtener las variables de entorno del archivo .env del backend
      isGlobal: true, //Lo hacemos global para que lo podamos usar en cualquier parte del codigo
      envFilePath: '.env', /// le mandamos la ruta del .env a cargar
    }),
    GoogleAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
