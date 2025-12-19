import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@tembiapo/db';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /// Buscar usuario por email
  async findByEmail(mail: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { mail },
    });
  }

  /// Buscar usuario por username
  async findByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { username },
    });
  }

  /// Buscar usuario por ID
  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  /// Método para crear un usuario en la BD
  async createUser(
    username: string,
    mail: string,
    pictureUrl: string,
    password: string,
    roleId: string,
    personId: string,
    isOauthUser: boolean,
  ): Promise<User> {
    return await this.prisma.user.create({
      data: {
        username: username,
        mail: mail,
        avatarUrl: pictureUrl,
        password: password,
        roleId: roleId,
        personId: personId,
        isOauthUser: isOauthUser,
      }, // los timestamp los maneja la DB
    });
  }

  /// Métodos para validar en servidor y BD
  async isEmailExists(mail: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { mail },
      select: { id: true },
    });
    return !!user;
  }

  async isUsernameExists(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    return !!user;
  }

  /// Buscar usuario con persona incluida
  async findUserWithPerson(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        person: true,
        role: true,
        professional: true,
      },
    });
  }

  /// Baja lógica (soft delete)
  async softDelete(id: string): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /// Reactivar usuario
  async activate(id: string): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }

  /// Buscar usuarios activos (no eliminados)
  async findActiveUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  /// Buscar todos los usuarios con su información de persona y rol
  async findAllUsersWithDetails() {
    return await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        person: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /// Cambiar contraseña
  async changePassword(id: string, newPassword: string): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        // updated_at se actualiza automáticamente por tu DB
      },
    });
  }

  // Establecer token de restablecimiento de contraseña
  async setResetPasswordToken(
    id: string,
    hashToken: string,
    expiresAt: Date,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        hashResetPassword: hashToken,
        hashResetPasswordExpiresAt: expiresAt,
      },
    });
  }

  /// Limpiar el token de restablecimiento de contraseña
  async clearResetPasswordToken(id: string): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        hashResetPassword: null,
        hashResetPasswordExpiresAt: null,
      },
    });
  }

  /// Actualizar avatar
  async updateAvatar(id: string, avatarUrl: string): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        avatarUrl,
      },
    });
  }

  /// Actualizar username
  async updateUsername(id: string, username: string): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        username,
      },
    });
  }
}
