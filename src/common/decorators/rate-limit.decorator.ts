import { SetMetadata } from '@nestjs/common';

// Configuración para rate limiting
export interface RateLimitConfig {
  ttl: number; // tiempo en segundos
  limit: number; // número máximo de requests
  message?: string; // mensaje personalizado
}

// Metadata key para el decorator
export const RATE_LIMIT_KEY = 'rateLimit';

// Decorator principal para rate limiting
export const RateLimit = (config: RateLimitConfig) => 
  SetMetadata(RATE_LIMIT_KEY, config);

// Decorators predefinidos para casos comunes

// Para endpoints de autenticación (más restrictivo)
export const AuthRateLimit = () => 
  RateLimit({
    ttl: 900, // 15 minutos
    limit: 5, // 5 intentos
    message: 'Demasiados intentos de autenticación. Intente nuevamente en 15 minutos.'
  });

// Para endpoints de consulta general
export const StandardRateLimit = () => 
  RateLimit({
    ttl: 60, // 1 minuto
    limit: 30, // 30 requests
    message: 'Demasiadas solicitudes. Intente nuevamente en un minuto.'
  });

// Para endpoints de creación/modificación
export const WriteRateLimit = () => 
  RateLimit({
    ttl: 60, // 1 minuto
    limit: 10, // 10 requests
    message: 'Demasiadas operaciones de escritura. Intente nuevamente en un minuto.'
  });

// Para endpoints públicos (más permisivo)
export const PublicRateLimit = () => 
  RateLimit({
    ttl: 60, // 1 minuto
    limit: 100, // 100 requests
    message: 'Límite de solicitudes excedido. Intente nuevamente en un minuto.'
  });