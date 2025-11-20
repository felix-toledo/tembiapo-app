import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RefreshToken, User } from "@tembiapo/db";


@Injectable()
export class RefreshTokenRepository {
  constructor(private prisma: PrismaService) {}

  ///metodo para crear el refresh token y guardarlo en base de datos
  async createRefreshToken(
    token: string,
    expiresAt: Date,
    userId: string,
  ): Promise<RefreshToken> {
    return await this.prisma.refreshToken.create({
      data: {
        token: token,
        expiresAt: expiresAt,
        userId: userId,
        revoked: false,
      },
    });
  }

  ///metodo para verificar que el usuario tenga un token activo y todavia no haya expirado
  async isUserHaveAnActiveTokenAndNoExpired(id: string): Promise<boolean> {
    const token = await this.prisma.refreshToken.findFirst({
      where: {
        userId: id,
        revoked: false,
      },
    });
    return !!token;
  }

  ///metodo para retornar el token del usuario
  async findActiveTokenByUserId(userId: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findFirst({
      where: {
        userId: userId,
        revoked: false,
        expiresAt: {
          gt: new Date(), // gt significa greater than
        },
      },
    });
  }

  //metodo para buscar un refresh token en la base de datos
  async findRefreshToken(refreshToken: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findFirst({
      where: { token: refreshToken },
    });
  }

  ///metodo para revocar un refresh token especifico
  async revokeRefreshToken(refreshToken: string): Promise<boolean> {
    const result = await this.prisma.refreshToken.updateMany({
      ///Usamos updateMany para asegurarnos de que si hay mas de un token igual (por error) que se revoquen todos
      where: { token: refreshToken, revoked: false }, /// donde el token sea igual al token que recibe por parametro y el revoked sea false
      data: { revoked: true }, /// aca le mandamos la data donde revoked va a ser true
    });

    return result.count > 0; /// devolvemos true si al menos un token fue revocado, false si no encontro ninguno activo
  }

 // Elimina todos los refresh tokens que estén revocados o expirados
async deleteRevokedOrExpiredRefreshTokens(): Promise<number> {
  const now = new Date();
  const result = await this.prisma.refreshToken.deleteMany({
    where: {
      OR: [
        { revoked: true },
        { expiresAt: { lt: now } }
      ]
    }
  });
  return result.count; // cantidad de tokens eliminados
}


async replaceRefreshToken(newToken : string, expiresAt: Date, userId : string) : Promise<RefreshToken>{
  //1. revoca todos los tokens activos del usuario
  await this.prisma.refreshToken.updateMany({
    where: {
      userId: userId,
      revoked: false,
      expiresAt: { gt: new Date() }
    },
    data: {revoked: true}
  });

  //2. creamos el nuevo refresh token
  return  this.createRefreshToken(newToken, expiresAt, userId)
}


  }
}
