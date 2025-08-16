import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ThrottlerModule } from '@nestjs/throttler'; // Desactivado para remover rate limiting
import { APP_INTERCEPTOR } from '@nestjs/core';
import { typeormConfig } from './database/typeorm.config';

import { HealthController } from './health/health.controller';
import { AuthModule } from './auth/auth.module';
import { PacienteModule } from './paciente/paciente.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { AuditModule } from './auditoria/auditoria.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { ResultadosModule } from './resultados/resultados.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: () => typeormConfig }),
    // ThrottlerModule.forRoot([{
    //   ttl: +process.env.THROTTLE_TTL! || 60,
    //   limit: +process.env.THROTTLE_LIMIT! || 100,
    // }]), // Desactivado para remover rate limiting
    AuthModule,
    PacienteModule,
    OrdenesModule,
    AuditModule,
    NotificacionesModule,
    ResultadosModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
