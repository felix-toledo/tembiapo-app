import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config'; // Importante para no hardcodear secretos
import { MailService } from './mailer.service';

@Module({
  imports: [
    // Usamos forRootAsync para poder inyectar el ConfigService.
    // Si usáramos forRoot() normal, no podríamos leer el .env aquí dentro fácilmente.
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.resend.com', // Host de Resend
          secure: true,
          port: 465,
          auth: {
            user: 'resend',
            pass: config.get<string>('RESEND_API_KEY'), // Lee del .env
          },
        },
        defaults: {
          // Configura el remitente por defecto para no repetirlo en cada mail
          from: `"Soporte Tembiapó" <${config.get<string>('MAIL_FROM') ?? 'onboarding@resend.dev'}>`,
        },
      }),
      inject: [ConfigService], // Inyectamos la dependencia
    }),
  ],
  providers: [MailService],
  exports: [MailService], // Esto permite que otros modulos usen MailService
})
export class MailModule {}
