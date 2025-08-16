import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditService } from './auditoria.service';
import { ListaAuditoriaQuery } from './auditoria.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Auditoría')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('auditoria')
export class AuditController {
  constructor(private service: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Listar registros de auditoría' })
  listar(@Query() q: ListaAuditoriaQuery) {
    return this.service.listar(q);
  }
}
