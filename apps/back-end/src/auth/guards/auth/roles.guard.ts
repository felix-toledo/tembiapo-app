import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { UserRepository } from '../../repository/user.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }
    // Obtiene el usuario que intentó entrar (ya validado previamente por el JwtAuthGuard)
    const request = context
      .switchToHttp()
      .getRequest<{ user: { userId: string } }>();
    const user = request.user;

    if (!user || !user.userId) {
      throw new ForbiddenException('User not found');
    }
    // Busca al usuario en la base de datos para ver qué rol tiene realmente
    const userDb = await this.userRepository.findUserWithPerson(user.userId);

    if (!userDb || !userDb.role) {
      throw new ForbiddenException('User role not found');
    }
    // Compara: ¿El rol del usuario está en la lista de roles requeridos?
    const hasRole = requiredRoles.some((role) => userDb.role.name === role);

    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
