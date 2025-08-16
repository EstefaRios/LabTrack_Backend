import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PacienteOnly } from '../common/decorators/roles.decorator';
import { OrdenesService } from './ordenes.service';
import { ListarOrdenesQuery } from './ordenes.dto';

@ApiTags('Órdenes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@PacienteOnly()
@Controller('ordenes')
export class OrdenesController {
  constructor(private service: OrdenesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar órdenes del paciente (paginación y filtros)' })
  async listar(@Query() q: ListarOrdenesQuery) {
    return this.service.listar(+q.personaId, {
      pagina: q.pagina ? +q.pagina : 1,
      desde: q.desde,
      hasta: q.hasta,
      busca: q.busca,
      asc: q.asc === '1',
    });
  }

  @Get(':id/resultados')
  @ApiOperation({ summary: 'Detalle de resultados agrupados por grupo/procedimiento' })
  async resultados(@Param('id') id: string) {
    console.log('=== ENDPOINT /ordenes/:id/resultados LLAMADO ===');
    console.log('ID de orden recibido:', id);
    return this.service.resultados(+id);
  }
}
