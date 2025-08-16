import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Middleware opcional: extrae el bearer token (útil para auditoría/ip)
@Injectable()
export class JwtExtractMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];
    if (auth?.startsWith('Bearer ')) {
      (req as any).accessToken = auth.substring(7);
    }
    (req as any).ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    next();
  }
}
