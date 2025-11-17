import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { RefreshToken } from "@tembiapo/db";

@Injectable()
export class RefreshTokenRepository{
    constructor(private prisma : PrismaService){}


    ///metodo para crear el refresh token y guardarlo en base de datos
    async createRefreshToken(token : string, expiresAt : Date, userId: string) : Promise<RefreshToken>{
        return await this.prisma.refreshToken.create({
            data: {
                token : token,
                expiresAt: expiresAt,
                userId: userId,
                revoked: false
            }
        })
    }

    ///metodo para verificar que el usuario tenga un token activo y todavia no haya expirado
    async isUserHaveAnActiveTokenAndNoExpired(id : string) : Promise<boolean>{
         const token = await this.prisma.refreshToken.findFirst({
            where: {
                userId: id,
                revoked : false
            }
         })
         return !!token
    }

    ///metodo para retornar el token del usuario
    async findActiveTokenByUserId(userId: string): Promise<RefreshToken | null> {
    
    return  this.prisma.refreshToken.findFirst({
      where: {
        userId: userId,
        revoked: false, 
        expiresAt: {
            gt: new Date() // gt significa greater than
        },
      },
    });
  }
}