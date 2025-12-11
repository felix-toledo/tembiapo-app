import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mailer.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.resend.com',
          secure: true,
          port: 465,
          auth: {
            user: 'resend',
            pass: config.get<string>('RESEND_API_KEY'),
          },
        },
        defaults: {
          // OJO: Aquí aseguramos la CONFIANZA.
          // Usa el subdominio verificado (ej: no-reply@notificaciones.tembiapo.com.ar)
          from: `"Soporte Tembiapó" <${config.get<string>('MAIL_FROM') ?? 'no-reply@envios.tembiapo.app'}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
