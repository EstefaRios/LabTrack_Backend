import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './auditoria.controller';
import { AuditService } from './auditoria.service';
import { Auditoria } from './auditoria.modelo';

@Module({
  imports: [TypeOrmModule.forFeature([Auditoria])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
