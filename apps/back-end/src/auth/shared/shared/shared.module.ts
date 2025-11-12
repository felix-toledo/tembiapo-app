///cree este shared module porque me tiraba un error a la hora de iniciar el serivdor de nest que no reconocia el PersonRepository
import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UserRepository } from '../../repository/user.repository';
import { PersonRepository } from '../../repository/person.repository';
import { RoleService } from '../../services/role.service';

@Global() // Esto hace que los providers estén disponibles en toda la app
@Module({
  providers: [PrismaService, UserRepository, PersonRepository, RoleService],
  exports: [PrismaService, UserRepository, PersonRepository, RoleService],
})
export class SharedModule {}