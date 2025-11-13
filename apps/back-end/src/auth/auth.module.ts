import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule,
    JwtModule.registerAsync({ ///registramos de forma asincrona el modulo de jwt donde importamos el configModule y configService
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService : ConfigService) => ({ ///Llamamos a la funcion useFactory (viene del jwtModuleOptions), esto espera: useFactory?: (...args: any[]) => Promise<JwtModuleOptions> | JwtModuleOptions;
        secret: configService.get<string>('SIGNED_JWT'), /// le registramos en el JwtModule nuestro secret traido del .env donde esta nuestra variable de entorno
        signOptions: {expiresIn: '1h'}, // Le damos una expiracion a los access token de una hora
      }),
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
