import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Verificar que el token esté presente
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de acceso requerido');
    }
    
    const token = authHeader.substring(7);
    if (!token || token.length < 10) {
      throw new UnauthorizedException('Token de acceso inválido');
    }
    
    return super.canActivate(context);
  }
  
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido');
      }
      if (info?.name === 'NotBeforeError') {
        throw new UnauthorizedException('Token no válido aún');
      }
      throw new UnauthorizedException('Acceso no autorizado');
    }
    
    // Validar que el usuario tenga los campos requeridos
    if (!user.sub || typeof user.sub !== 'number') {
      throw new UnauthorizedException('Token con formato inválido');
    }
    
    return user;
  }
}
