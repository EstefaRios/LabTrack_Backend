import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Inject,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap, catchError } from 'rxjs';
import { AUDIT_ACTION } from '../decorators/audit.decorator';
import { AuditService } from '../../auditoria/auditoria.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private reflector: Reflector,
    @Inject(AuditService) private audit: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const action = this.reflector.get<string>(
      AUDIT_ACTION,
      context.getHandler(),
    );
    if (!action) return next.handle();

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    // IP (considerando proxies)
    const ipRaw =
      req.headers['x-forwarded-for'] ||
      req.headers['x-real-ip'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      'unknown';
    const clientIp = Array.isArray(ipRaw)
      ? ipRaw[0]
      : String(ipRaw ?? '')
          .split(',')[0]
          .trim() || 'unknown';

    const userAgent = (req.headers['user-agent'] as string) || 'unknown';

    // Body sanitizado
    const sanitizedBody = this.sanitizeBody(req.body);

    // Contexto del request que se guarda en JSONB 'cuerpo'
    const requestData = {
      method: req.method,
      url: (req.originalUrl || req.url) as string,
      body: sanitizedBody,
      query: req.query,
      headers: {
        'user-agent': userAgent,
        'content-type': req.headers['content-type'],
      },
    };

    // Construir idUsuario y recordId de forma robusta
    const idUsuarioFinal =
      Number(req?.user?.sub ?? req?.user?.id ?? NaN) ||
      Number(req.body?.personaId ?? NaN) ||
      null;

    const recordId =
      (req.params?.id && Number(req.params.id)) ||
      Number(req?.user?.sub ?? req?.user?.id ?? req.body?.personaId ?? NaN) ||
      0; // fallback para NO violar NOT NULL en DB

    return next.handle().pipe(
      // Éxito
      tap(async (result) => {
        try {
          await this.audit.log({
            idUsuario: idUsuarioFinal,
            accion: action,
            tableName: this.extractTableName(req.route?.path),
            recordId, // ✅ nunca nulo
            estadoHttp: res.statusCode || 200,
            ipAddress: clientIp,
            ip: clientIp,
            agenteUsuario: userAgent,
            momento: new Date(), // ✅ timestamptz
            cuerpo: requestData, // ✅ jsonb
            newData: this.sanitizeResult(result),
          });
        } catch (e: any) {
          this.logger.warn(
            `No se pudo guardar auditoría OK: ${e?.message ?? e}`,
          );
        }
      }),

      // Error
      catchError(async (error) => {
        try {
          await this.audit.log({
            idUsuario: idUsuarioFinal,
            accion: `${action}_ERROR`,
            tableName: this.extractTableName(req.route?.path),
            recordId, // ✅ también aquí
            estadoHttp: error?.status || 500,
            ipAddress: clientIp,
            ip: clientIp,
            agenteUsuario: userAgent,
            momento: new Date(),
            cuerpo: requestData,
            newData: { error: error?.message ?? 'unknown' },
          });
        } catch (e: any) {
          this.logger.warn(
            `No se pudo guardar auditoría ERROR: ${e?.message ?? e}`,
          );
        }
        throw error;
      }),
    );
  }

  // --------- helpers ---------
  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body;
    const sanitized: Record<string, any> = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
    for (const field of sensitiveFields)
      if (field in sanitized) sanitized[field] = '[REDACTED]';
    return sanitized;
  }

  private sanitizeResult(result: any): any {
    if (!result || typeof result !== 'object') return result;
    const sanitized: Record<string, any> = { ...result };
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    for (const field of sensitiveFields)
      if (field in sanitized) sanitized[field] = '[REDACTED]';
    return sanitized;
  }

  private extractTableName(routePath?: string): string | null {
    if (!routePath) return null;
    const clean = routePath.split('?')[0];
    const seg = clean.split('/').filter(Boolean)[0]; // '/auth/login-paciente' -> 'auth'
    return seg ?? null;
  }
}
