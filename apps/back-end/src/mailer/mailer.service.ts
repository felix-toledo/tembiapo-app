import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

const appUrl = process.env.FRONT_URL || 'https://tembiapo.app';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  /**
   * Envía el correo de bienvenida y verificación.
   * Nomenclatura Intencional: Decimos QUÉ hace (sendVerification), no CÓMO (sendEmail).
   */
  async sendWelcomeMail(
    email: string,
    token: string,
    name: string,
  ): Promise<void> {
    const url = `${appUrl}/auth/verify?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Bienvenido a Tembiapó - Verifica tu cuenta',
      html: `
        <h1>Hola ${name}, bienvenido a la comunidad de tembiapó!.</h1>
        <p>Para validar que sos un profesional real, por favor logueate, creá tu perfil profesional y verificá tu DNI</p>
        <a href="${'https://tembiapo.app/create-professional'}">Creá tu perfil profesional</a>
        <p>Si no solicitaste esto, ignora este mensaje.</p>
      `,
    });
  }

  async sendPasswordResetMail(
    email: string,
    token: string,
    name: string,
  ): Promise<void> {
    const url = `${appUrl}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Tembiapó - Restablece tu contraseña',
      html: `
        <h1>Hola ${name},</h1>
        <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
        <a href="${url}">Restablecer mi contraseña</a>
        <p>Si no solicitaste esto, ignora este mensaje.</p>
      `,
    });
  }
}
