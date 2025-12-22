//==================IMPORTS GENERALES==================
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from '@tembiapo/types';

//===================REPOSITORIOS========================
import { PersonRepository } from '../repository/person.repository';
import { UserRepository } from '../repository/user.repository';
import { RefreshTokenRepository } from '../repository/refresh-token.repository';
//================SERVICIOS=================
import { RoleService } from './role.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../mailer/mailer.service';
//===================DTOs====================
import { createApiResponse } from '../../shared/utils/api-response.factory';
import { RegisterRequestDTO } from '../DTOs/register-request.dto';
import { LoginResponseDTO } from '../DTOs/responses/login-response.dto';
import { LoginRequestDTO } from '../DTOs/login-request.dto';
import { RegisterResponseData } from '../DTOs/responses/register-response.dto';
import { LogoutResponseDTO } from '../DTOs/responses/logout-response.dto';
import { LogoutRequestDTO } from '../DTOs/logout-request.dto';
import {
  ForgotPasswordRequestDTO,
  ResetPasswordRequestDTO,
} from '../DTOs/forgotPassword-request.dto';
import {
  ForgotPasswordResponseDTO,
  ResetPasswordResponseDTO,
} from '../DTOs/responses/forgotPassword-response.dto';
//==========ENTIDADES=============
import { RefreshToken, User } from '@tembiapo/db';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private personRepository: PersonRepository,
    private userRepository: UserRepository,
    private roleService: RoleService,
    private jwtService: JwtService,
    private refreshTokenRepository: RefreshTokenRepository,
    private mailService: MailService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async register(
    register: RegisterRequestDTO,
    file?: Express.Multer.File,
  ): Promise<ApiResponse<RegisterResponseData | null>> {
    if (register === null) {
      throw new BadRequestException('No se encontro un DTO en la request');
    }

    ///1. verificamos primero que el email no exista
    const emailExists = await this.userRepository.isEmailExists(register.email);
    if (emailExists) {
      throw new ConflictException('El email ya se encuentra en uso');
    }

    ///2. verificamos que el username no exista
    const usernameExists = await this.userRepository.isUsernameExists(
      register.username,
    );

    if (usernameExists) {
      throw new ConflictException('El nombre de usuario no esta disponible');
    }

    ///3. verificamos que el dni no exista
    const dniExists = await this.personRepository.isDniExists(register.dni);

    if (dniExists) {
      throw new ConflictException('El DNI no se encuentra disponible');
    }

    ///4. Verificamos primero que las passwords coincidan
    if (register.password != register.confirmPassword) {
      throw new ConflictException('Las contraseñas no coinciden');
    }

    ///5. Si coinciden, hasheamos la password
    const hashedPassword = await bcrypt.hash(register.password, 10);

    ///6. Obtenemos el rol de profesional
    const proffesionalRole = await this.roleService.findByName('PROFESSIONAL');

    let avatarUrl = '';
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      avatarUrl = uploadResult.secure_url;
    }

    ///7. creamos una transaccion para crear el usuario y la persona asociada
    await this.prisma.$transaction(async () => {
      ///creamos la persona primero
      const person = await this.personRepository.createPerson(
        register.name,
        register.lastName,
        register.dni,
      );

      ///creamos el usuario con la personID
      const user = await this.userRepository.createUser(
        register.username,
        register.email,
        avatarUrl,
        hashedPassword,
        proffesionalRole.id,
        person.id,
        false,
      );

      // TODO: Implementar envío de email una vez configurado el servicio de email
      try {
        await this.mailService.sendWelcomeMail(
          register.email,
          'asd',
          register.name,
        );
      } catch (error) {
        // Para el MVP, logueamos el error pero NO fallamos el registro,
        // el usuario podrá pedir "Reenviar correo de confirmación" después.
        console.error('Error enviando email de verificación:', error);
      }
      // retornamos el person y user
      return { person, user };
    });

    /*aca como dijimos que va a devoler una Promise<RegisterResponse> seteamos que el success es true 
        y de data la response que creamos arriba
        (como la clase es async, en el controller la llamamos con await)
        */
    return createApiResponse({ message: 'Usuario registrado correctamente!' });
  }

  ///Funcion de inicio de sesion
  async login(
    loginRequest: LoginRequestDTO,
  ): Promise<ApiResponse<LoginResponseDTO>> {
    ///Utilice el patron factory function para los responses de la API

    ///Valida que la request no este vacia
    if (!loginRequest) {
      throw new BadRequestException('No se encontro un DTO en el body');
    }

    const user: User | null = await this.userRepository.findByEmail(
      loginRequest.email,
    ); ///Buscamos el usuario por el email que llego en la request (manejamos el caso de que sea null)

    if (!user) {
      throw new UnauthorizedException('El email o la contraseña es incorrecto');
    }

    const password = user.password;
    if (!password) {
      throw new UnauthorizedException('El email o la contraseña es incorrecto');
    }

    const isMatch = await bcrypt.compare(
      loginRequest.password,
      user.password ? user.password : '',
    );
    if (!isMatch) {
      throw new UnauthorizedException('El email o la contraseña es incorrecto');
    }

    ///Obtenemos el rol del usuario que esta iniciando sesion para futuras protecciones
    const role = await this.roleService.findById(user.roleId);

    const payload = { email: user.mail, sub: user.id, role: role.name }; //creamos el payload (los valores) que va a guardar nuestro token
    const access_token = this.jwtService.sign(payload, {
      ///firmamos el token
      expiresIn: '15m', ///expiracion de 15 minutos
    });

    ///Buscamos si el usuario que intenta iniciar sesion ya tiene un token que todavia no vencio y no esta revocado
    let refreshTokenObject: RefreshToken | null =
      await this.refreshTokenRepository.findActiveTokenByUserId(user.id);

    if (!refreshTokenObject) {
      /// si retorna false, quiere decir que el usuario que intenta iniciar sesion no tiene un refresh token
      const refresh_token = this.jwtService.sign(payload, {
        /// creamos el token y lo firmamos
        expiresIn: '7d', /// la expiracion del refresh token va a ser de 7 dias
      });

      const expires = new Date(); /// seteamos la fecha de expiracion
      expires.setDate(expires.getDate() + 7); ///le agregamos 7 dias para que coincida con el expire del token

      ///Guardamos el token en la DB y asignamos el resultado
      refreshTokenObject = await this.refreshTokenRepository.createRefreshToken(
        refresh_token,
        expires,
        user.id,
      );
    }

    const data: LoginResponseDTO = {
      ///creamos el data que vamos a devolver al front
      message: 'Inicio de sesion exitoso!',
      accessToken: access_token,
      refreshToken: refreshTokenObject.token, ///devolvemos el refresh token para que en el controller podamos setear la cookie
    };

    return createApiResponse(data, true);
  }

  ///funcion para el cierre de sesion e invalidacion de refresh token
  async logout(
    logoutRequest: LogoutRequestDTO,
  ): Promise<ApiResponse<LogoutResponseDTO>> {
    ///verificamos que la peticion no llegue con un body vacio
    if (!logoutRequest) {
      throw new NotFoundException(
        'La peticion no puede enviarse con un body vacio',
      );
    }

    ///buscamos el refresh token en la base de datos
    const refreshToken: RefreshToken | null =
      await this.refreshTokenRepository.findRefreshToken(
        logoutRequest.refreshToken,
      );

    ///verificamos si el token recibido existe en la base de datos
    if (!refreshToken) {
      throw new NotFoundException('No existe el refresh token a revocar');
    }

    ///si existe, llamamos a la funcion de nuestro refreshTokenRepository para revocar el token
    const result = await this.refreshTokenRepository.revokeRefreshToken(
      refreshToken.token,
    );

    if (!result) {
      throw new NotFoundException('No se encontro un token activo');
    }

    const data: LogoutResponseDTO = {
      message: 'El cierre de sesion fue exitoso!',
    };
    return createApiResponse(data, true);
  }

  async forgotPassword(
    forgotPasswordRequest: ForgotPasswordRequestDTO,
  ): Promise<ForgotPasswordResponseDTO> {
    const mail = forgotPasswordRequest.email;

    // check if mail exists with a user
    const user = await this.userRepository.findByEmail(mail);
    if (user) {
      // generate a password reset token
      const person = await this.personRepository.findById(user.personId);
      const payload = { email: user.mail, sub: user.id };
      const resetToken = this.jwtService.sign(payload, {
        expiresIn: '1h', // token valid for 1 hour
      });
      const hashTokenResetPassword = await bcrypt.hash(resetToken, 10);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      await this.userRepository.setResetPasswordToken(
        user?.id,
        hashTokenResetPassword,
        expiresAt,
      );
      // send password reset email
      try {
        await this.mailService.sendPasswordResetMail(
          mail,
          resetToken,
          person ? person.name : '',
        );
      } catch (error) {
        console.error('Error enviando email de restablecimiento:', error);
      }
    }

    const message: ForgotPasswordResponseDTO = {
      message:
        'Si tu correo existe en nuestra base de datos, recibirás un email con las instrucciones para restablecer tu contraseña.',
    };
    return message;
  }

  async resetPassword(
    ressetPasswordDto: ResetPasswordRequestDTO,
  ): Promise<ResetPasswordResponseDTO> {
    const { resetToken, newPassword, confirmPassword } = ressetPasswordDto;
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const payload: { email: string; sub: string } =
      this.jwtService.verify(resetToken);

    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el token hash sea válido
    if (!user.hashResetPassword) {
      throw new BadRequestException('Token de restablecimiento inválido');
    }

    const isValid = await bcrypt.compare(resetToken, user.hashResetPassword);

    if (!isValid) {
      throw new BadRequestException('Token de restablecimiento inválido');
    }

    // Verificar que el token no haya expirado
    if (
      user.hashResetPasswordExpiresAt &&
      user.hashResetPasswordExpiresAt < new Date()
    ) {
      throw new BadRequestException('El token de restablecimiento ha expirado');
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña y limpiar el token de reset
    await this.userRepository.changePassword(user.id, hashedPassword);
    await this.userRepository.clearResetPasswordToken(user.id);

    const message: ResetPasswordResponseDTO = {
      message: 'Tu contraseña ha sido restablecida exitosamente',
    };

    return message;
  }

  /// Método para refrescar el access token usando el refresh token
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<ApiResponse<{ accessToken: string }>> {
    if (!refreshToken) {
      throw new UnauthorizedException('No se proporcionó refresh token');
    }

    // Buscar el refresh token en la DB con los datos del usuario
    const tokenData =
      await this.refreshTokenRepository.findValidRefreshTokenWithUser(
        refreshToken,
      );

    if (!tokenData) {
      throw new UnauthorizedException(
        'El refresh token es inválido o ha expirado',
      );
    }

    // Generar nuevo access token
    const payload = {
      email: tokenData.user.mail,
      sub: tokenData.user.id,
      role: tokenData.user.role.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    return createApiResponse({ accessToken }, true);
  }
}
