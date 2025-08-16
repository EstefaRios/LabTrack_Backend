import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Extender el tipo Request para incluir la propiedad user
interface AuthenticatedRequest extends Request {
  user?: JwtUser;
}

// Interfaz para el usuario del JWT
export interface JwtUser {
  sub: number; // id del usuario
  username: string;
  email?: string;
  tipo?: string; // tipo de usuario (paciente, admin, medico, laboratorio)
  iat?: number;
  exp?: number;
}

// Decorator para obtener el usuario actual del JWT
export const CurrentUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext): JwtUser | any => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      return null;
    }

    // Si se especifica una propiedad específica, devolverla
    return data ? user[data] : user;
  },
);

// Decorator específico para obtener solo el ID del usuario
export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number | null => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    return user?.sub || null;
  },
);
