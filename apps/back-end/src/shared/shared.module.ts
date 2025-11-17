///cree este shared module porque me tiraba un error a la hora de iniciar el serivdor de nest que no reconocia el PersonRepository
import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../auth/repository/user.repository';
import { PersonRepository } from '../auth/repository/person.repository';
import { RoleService } from '../auth/services/role.service';
import { RefreshTokenRepository } from '../auth/repository/refresh-token.repository';

@Global() // Esto hace que los providers estén disponibles en toda la app
@Module({
  providers: [PrismaService, UserRepository, PersonRepository, RoleService, RefreshTokenRepository],
  exports: [PrismaService, UserRepository, PersonRepository, RoleService, RefreshTokenRepository],
})
export class SharedModule {}