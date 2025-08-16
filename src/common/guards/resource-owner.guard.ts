import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtUser } from '../decorators/current-user.decorator';
import 'reflect-metadata';

// Extender el tipo Request para incluir la propiedad user
interface AuthenticatedRequest extends Request {
  user?: JwtUser;
}

// Metadata key para el decorator
export const RESOURCE_OWNER_KEY = 'resourceOwner';

// Decorator para marcar endpoints que requieren validación de propietario
export const ResourceOwner = (paramName: string = 'idUsuario') =>
  Reflect.metadata(RESOURCE_OWNER_KEY, paramName);

@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener el nombre del parámetro desde el metadata
    const paramName = this.reflector.get<string>(
      RESOURCE_OWNER_KEY,
      context.getHandler(),
    );

    // Si no hay metadata, permitir acceso
    if (!paramName) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    
    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Obtener el valor del parámetro de la URL, query o body
    const resourceUserId = this.extractUserId(request, paramName);
    
    if (!resourceUserId) {
      throw new BadRequestException(`Parámetro ${paramName} requerido`);
    }

    // Validar que el usuario solo acceda a sus propios recursos
    if (user.sub !== parseInt(resourceUserId.toString(), 10)) {
      throw new ForbiddenException('No tienes permisos para acceder a este recurso');
    }

    return true;
  }

  private extractUserId(request: AuthenticatedRequest, paramName: string): string | number | null {
    // Buscar en parámetros de ruta
    if (request.params[paramName]) {
      return request.params[paramName];
    }

    // Buscar en query parameters
    if (request.query[paramName]) {
      return request.query[paramName] as string;
    }

    // Buscar en el body
    if (request.body && request.body[paramName]) {
      return request.body[paramName];
    }

    return null;
  }
}