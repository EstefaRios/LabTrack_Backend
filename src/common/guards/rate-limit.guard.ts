import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RATE_LIMIT_KEY, RateLimitConfig } from '../decorators/rate-limit.decorator';
import { JwtUser } from '../decorators/current-user.decorator';

// Estructura para almacenar información de rate limiting
interface RateLimitInfo {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly storage = new Map<string, RateLimitInfo>();

  constructor(private reflector: Reflector) {
    // Limpiar entradas expiradas cada 5 minutos
    setInterval(() => this.cleanupExpiredEntries(), 5 * 60 * 1000);
  }

  canActivate(context: ExecutionContext): boolean {
    // Obtener configuración de rate limiting desde el metadata
    const rateLimitConfig = this.reflector.getAllAndOverride<RateLimitConfig>(
      RATE_LIMIT_KEY,
      [context.getHandler(), context.getClass()]
    );

    // Si no hay configuración de rate limiting, permitir acceso
    if (!rateLimitConfig) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const key = this.generateKey(request);
    const now = Date.now();
    const windowStart = now - rateLimitConfig.ttl * 1000;

    // Obtener o crear información de rate limiting
    let rateLimitInfo = this.storage.get(key);

    if (!rateLimitInfo || rateLimitInfo.resetTime <= now) {
      // Crear nueva ventana de tiempo
      rateLimitInfo = {
        count: 1,
        resetTime: now + rateLimitConfig.ttl * 1000,
      };
      this.storage.set(key, rateLimitInfo);
      return true;
    }

    // Incrementar contador
    rateLimitInfo.count++;

    // Verificar si se excedió el límite
    if (rateLimitInfo.count > rateLimitConfig.limit) {
      const resetTimeSeconds = Math.ceil((rateLimitInfo.resetTime - now) / 1000);
      
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: rateLimitConfig.message || 'Demasiadas solicitudes',
          error: 'Too Many Requests',
          retryAfter: resetTimeSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }

  private generateKey(request: any): string {
    // Priorizar usuario autenticado, luego IP
    const user = request.user as JwtUser;
    if (user?.sub) {
      return `user:${user.sub}`;
    }

    // Obtener IP real considerando proxies
    const ip = this.getRealIP(request);
    return `ip:${ip}`;
  }

  private getRealIP(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      'unknown'
    );
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, info] of this.storage.entries()) {
      if (info.resetTime <= now) {
        this.storage.delete(key);
      }
    }
  }
}