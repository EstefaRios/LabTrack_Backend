import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { JwtUser } from '../decorators/current-user.decorator';

// Extender el tipo Request para incluir la propiedad user
interface AuthenticatedRequest extends Request {
  user?: JwtUser;
  params: any;
  query: any;
  body: any;
}

@Injectable()
export class NotificationOwnerGuard implements CanActivate {
  constructor(private dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Obtener el ID de la notificación desde los parámetros
    const notificationId = request.params.id;

    if (!notificationId) {
      throw new ForbiddenException('ID de notificación requerido');
    }

    // Verificar que la notificación pertenece al usuario
    const notification = await this.dataSource
      .createQueryBuilder()
      .select('n.id_usuario')
      .from('notification', 'n')
      .where('n.id = :id', { id: notificationId })
      .getRawOne();

    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }

    if (notification.id_usuario !== user.sub) {
      throw new ForbiddenException(
        'No tienes permisos para modificar esta notificación',
      );
    }

    return true;
  }
}
