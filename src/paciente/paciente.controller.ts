import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PacienteService } from './paciente.service';
import { PerfilQuery, ListarPacientesQuery } from './paciente.dto';

@ApiTags('Paciente')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('perfil')
export class PacienteController {
  constructor(private service: PacienteService) {}

  @Get()
  @ApiOperation({ summary: 'Perfil del paciente por personaId' })
  async getPerfil(@Query() q: PerfilQuery) {
    return this.service.getPerfil(+q.personaId);
  }

  @Get('listar')
  @ApiOperation({ summary: 'Listar todos los pacientes con paginación y búsqueda' })
  async listarPacientes(@Query() q: ListarPacientesQuery) {
    return this.service.listarPacientes(q.pagina, q.limite, q.busqueda);
  }
}
