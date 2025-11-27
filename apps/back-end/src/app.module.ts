import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GoogleAuthModule } from './google-auth/google-auth.module';
import { ProfileModule } from './profile/profile.module';
import { FieldModule } from './fields/field.module';
import { ServiceAreaModule } from './service-area/service-area.module';

///=============hacemos la carpeta de uploads publica para el frontend
import {ServeStaticModule} from '@nestjs/serve-static'
import { join } from 'path';
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
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'), 
      serveRoot: '/uploads', // Esto hará que accedan como http://localhost:3000/uploads/avatars/foto.jpg
      serveStaticOptions:{
        index: false
      }
    }),
    GoogleAuthModule,
    ProfileModule,
    FieldModule,
    ServiceAreaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
