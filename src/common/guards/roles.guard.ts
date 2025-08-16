import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRole } from '../decorators/roles.decorator';
import { JwtUser } from '../decorators/current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos desde el metadata
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay roles especificados, permitir acceso
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtUser;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Determinar el rol del usuario basado en el tipo en el JWT
    const userRole = this.getUserRole(user);

    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasRole = requiredRoles.some((role) => role === userRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado. Roles requeridos: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }

  private getUserRole(user: JwtUser): UserRole {
    // Por defecto, todos los usuarios que se loguean son pacientes
    // En el futuro se puede extender para otros tipos de usuario
    if (user.tipo) {
      // Si hay un campo 'tipo' en el JWT, usarlo para determinar el rol
      switch (user.tipo.toLowerCase()) {
        case 'admin':
          return UserRole.ADMIN;
        case 'medico':
        case 'doctor':
          return UserRole.MEDICO;
        case 'laboratorio':
        case 'lab':
          return UserRole.LABORATORIO;
        default:
          return UserRole.PACIENTE;
      }
    }

    // Por defecto, asumir que es paciente
    return UserRole.PACIENTE;
  }
}
