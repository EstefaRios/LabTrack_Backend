import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PacienteOnly } from '../common/decorators/roles.decorator';
import { ResultadosService } from './resultados.service';
import {
  GetResultadosParamsDto,
  ResultadosApiResponseDto,
  ResultadosCompletosResponseDto,
  PacienteInfoResponseDto,
  EstadisticasResponseDto,
} from './resultados.dto';
import {
  ResultadosCompletos,
  InfoPacienteYOrden,
  EstadisticasResultados,
} from './resultados.model';

@ApiTags('Resultados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@PacienteOnly()
@Controller('resultados')
export class ResultadosController {
  constructor(private service: ResultadosService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener resultados completos de una orden',
    description:
      'Obtiene todos los resultados de laboratorio de una orden específica, incluyendo información del paciente, orden y estadísticas',
  })
  @ApiParam({ name: 'id', description: 'ID de la orden', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Resultados obtenidos exitosamente',
    type: ResultadosApiResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async obtenerResultadosCompletos(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResultadosApiResponseDto> {
    try {
      return await this.service.getResultadosCompletos(id);
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor al obtener resultados',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/grupos')
  @ApiOperation({
    summary: 'Obtener solo los grupos con resultados de una orden',
    description:
      'Obtiene únicamente la estructura de grupos, procedimientos y pruebas con sus resultados',
  })
  @ApiParam({ name: 'id', description: 'ID de la orden', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Grupos obtenidos exitosamente',
    type: ResultadosCompletosResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  async obtenerGruposConResultados(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResultadosCompletosResponseDto> {
    try {
      const grupos = await this.service.getGruposConResultados(id);
      return { grupos };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor al obtener grupos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/paciente')
  @ApiOperation({
    summary: 'Obtener información del paciente y orden',
    description:
      'Obtiene la información del paciente y los datos de la orden asociados a un ID de orden específico',
  })
  @ApiParam({ name: 'id', description: 'ID de la orden', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Información del paciente obtenida exitosamente',
    type: PacienteInfoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Orden o paciente no encontrado',
  })
  async obtenerInfoPaciente(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PacienteInfoResponseDto> {
    try {
      const info = await this.service.getInfoPacienteYOrden(id);
      return {
        paciente: info.paciente,
        orden: info.orden,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor al obtener información',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/estadisticas')
  @ApiOperation({
    summary: 'Obtener estadísticas de resultados de una orden',
    description:
      'Obtiene estadísticas detalladas sobre los resultados de laboratorio de una orden específica',
  })
  @ApiParam({ name: 'id', description: 'ID de la orden', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    type: EstadisticasResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  async obtenerEstadisticas(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EstadisticasResponseDto> {
    try {
      const estadisticas = await this.service.getEstadisticasResultados(id);
      return { estadisticas };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor al obtener estadísticas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/verificar')
  @ApiOperation({
    summary: 'Verificar si existe una orden',
    description:
      'Verifica la existencia de una orden y retorna información básica de la misma',
  })
  @ApiParam({ name: 'id', description: 'ID de la orden', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Orden verificada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  async verificarOrden(@Param('id', ParseIntPipe) id: number) {
    try {
      const orden = await this.service.verificarOrden(id);
      if (!orden) {
        throw new HttpException(
          `Orden con ID ${id} no encontrada`,
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        existe: true,
        orden,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor al verificar orden',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
