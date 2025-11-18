import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CookieParserMiddleware } from './middlewares/cookie-parser.middleware';
import { RefreshTokenCleanupService } from './services/refresh-token-cleanup.service';
@Module({
  imports: [ConfigModule,
    JwtModule.registerAsync({ ///registramos de forma asincrona el modulo de jwt donde importamos el configModule y configService
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async(configService : ConfigService) => ({ ///Llamamos a la funcion useFactory (viene del jwtModuleOptions), esto espera: useFactory?: (...args: any[]) => Promise<JwtModuleOptions> | JwtModuleOptions;
        secret: configService.get<string>('SIGNED_JWT') /// le registramos en el JwtModule nuestro secret traido del .env donde esta nuestra variable de entorno
      }),
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {
  configure(consumer : MiddlewareConsumer){ /// configuramos el consumidor de nuestro middleware
    consumer
    .apply(CookieParserMiddleware) //aplicamos el cookieParserMiddleware que creamos
    .forRoutes({path: 'auth/logout', method: RequestMethod.POST}) /// especificamos para que rutas se va a aplicar el middleware y para que metodo
  }
}
