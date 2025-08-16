import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// DTOs para validación de entrada
export class GetResultadosParamsDto {
  @ApiProperty({ description: 'ID de la orden' })
  @IsNumber()
  @Type(() => Number)
  id: number;
}

// DTOs para respuestas
export class ResultadoDto {
  @ApiProperty({ description: 'ID del resultado' })
  id: number;

  @ApiProperty({ description: 'Fecha del resultado' })
  fecha: string;

  @ApiProperty({ description: 'ID de la orden' })
  idOrden: number;

  @ApiProperty({ description: 'ID del procedimiento' })
  idProcedimiento: number;

  @ApiProperty({ description: 'ID de la prueba' })
  idPrueba: number;

  @ApiProperty({ description: 'ID de la opción de prueba', required: false })
  @IsOptional()
  idPruebaOpcion?: number;

  @ApiProperty({ description: 'Resultado como opción', required: false })
  @IsOptional()
  resOpcion?: string;

  @ApiProperty({ description: 'Resultado numérico', required: false })
  @IsOptional()
  resNumerico?: number;

  @ApiProperty({ description: 'Resultado como texto', required: false })
  @IsOptional()
  resTexto?: string;

  @ApiProperty({ description: 'Resultado como memo', required: false })
  @IsOptional()
  resMemo?: string;

  @ApiProperty({ description: 'Número de procesamientos' })
  numProcesamientos: number;

  @ApiProperty({ description: 'Valor de referencia mínimo', required: false })
  @IsOptional()
  valor_ref_min?: number;

  @ApiProperty({ description: 'Valor de referencia máximo', required: false })
  @IsOptional()
  valor_ref_max?: number;
}

export class PruebaDto {
  @ApiProperty({ description: 'ID de la prueba' })
  id: number;

  @ApiProperty({ description: 'Código de la prueba' })
  codigoPrueba: string;

  @ApiProperty({ description: 'Nombre de la prueba' })
  nombrePrueba: string;

  @ApiProperty({ description: 'Unidad de medida', required: false })
  @IsOptional()
  unidad?: string;

  @ApiProperty({ description: 'ID del tipo de resultado' })
  idTipoResultado: number;
}

export class ProcedimientoDto {
  @ApiProperty({ description: 'ID del procedimiento' })
  id: number;

  @ApiProperty({ description: 'ID de CUPS', required: false })
  @IsOptional()
  idCups?: number;

  @ApiProperty({ description: 'Método del procedimiento', required: false })
  @IsOptional()
  metodo?: string;

  @ApiProperty({ description: 'Código del procedimiento' })
  codigo: string;

  @ApiProperty({ description: 'Nombre del procedimiento' })
  nombre: string;
}

export class PruebaConResultadoDto {
  @ApiProperty({ type: PruebaDto })
  @ValidateNested()
  @Type(() => PruebaDto)
  prueba: PruebaDto;

  @ApiProperty({ type: ResultadoDto })
  @ValidateNested()
  @Type(() => ResultadoDto)
  resultado: ResultadoDto;
}

export class ProcedimientoConPruebasDto {
  @ApiProperty({ description: 'ID del procedimiento' })
  procedimientoId: number;

  @ApiProperty({ type: ProcedimientoDto })
  @ValidateNested()
  @Type(() => ProcedimientoDto)
  procedimiento: ProcedimientoDto;

  @ApiProperty({ type: [PruebaConResultadoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PruebaConResultadoDto)
  pruebas: PruebaConResultadoDto[];
}

export class GrupoConProcedimientosDto {
  @ApiProperty({ description: 'ID del grupo' })
  grupoId: number;

  @ApiProperty({ description: 'Código del grupo' })
  grupoCodigo: string;

  @ApiProperty({ description: 'Nombre del grupo' })
  grupoNombre: string;

  @ApiProperty({ type: [ProcedimientoConPruebasDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProcedimientoConPruebasDto)
  procedimientos: ProcedimientoConPruebasDto[];
}

export class PacienteDto {
  @ApiProperty({ description: 'ID del paciente' })
  id: number;

  @ApiProperty({ description: 'Tipo de documento' })
  tipo_documento: string;

  @ApiProperty({ description: 'Número de documento' })
  numero_documento: string;

  @ApiProperty({ description: 'Nombres del paciente' })
  nombres: string;

  @ApiProperty({ description: 'Apellidos del paciente' })
  apellidos: string;

  @ApiProperty({ description: 'Fecha de nacimiento' })
  fecha_nacimiento: string;

  @ApiProperty({ description: 'Género del paciente' })
  genero: string;

  @ApiProperty({ description: 'Teléfono', required: false })
  @IsOptional()
  telefono?: string;

  @ApiProperty({ description: 'Email', required: false })
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Dirección', required: false })
  @IsOptional()
  direccion?: string;

  @ApiProperty({ description: 'Nombre de la EPS', required: false })
  @IsOptional()
  eps_nombre?: string;

  @ApiProperty({ description: 'Código de la EPS', required: false })
  @IsOptional()
  eps_codigo?: string;
}

export class OrdenDto {
  @ApiProperty({ description: 'ID de la orden' })
  id: number;

  @ApiProperty({ description: 'Número de la orden' })
  numero: string;

  @ApiProperty({ description: 'Fecha de la orden' })
  fecha: string;

  @ApiProperty({ description: 'Profesional externo', required: false })
  @IsOptional()
  profesional_externo?: string;
}

export class EstadisticasResultadosDto {
  @ApiProperty({ description: 'Total de resultados' })
  total_resultados: number;

  @ApiProperty({ description: 'Total de procedimientos' })
  total_procedimientos: number;

  @ApiProperty({ description: 'Total de grupos' })
  total_grupos: number;

  @ApiProperty({ description: 'Resultados numéricos' })
  resultados_numericos: number;

  @ApiProperty({ description: 'Resultados de opción' })
  resultados_opcion: number;

  @ApiProperty({ description: 'Resultados de texto' })
  resultados_texto: number;

  @ApiProperty({ description: 'Resultados de memo' })
  resultados_memo: number;
}

export class ResultadosApiResponseDto {
  @ApiProperty({ type: [GrupoConProcedimientosDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrupoConProcedimientosDto)
  grupos: GrupoConProcedimientosDto[];

  @ApiProperty({ type: PacienteDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PacienteDto)
  paciente?: PacienteDto;

  @ApiProperty({ type: OrdenDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrdenDto)
  orden?: OrdenDto;

  @ApiProperty({ type: EstadisticasResultadosDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => EstadisticasResultadosDto)
  estadisticas?: EstadisticasResultadosDto;
}

// DTOs para endpoints específicos
export class ResultadosCompletosResponseDto {
  @ApiProperty({ type: [GrupoConProcedimientosDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GrupoConProcedimientosDto)
  grupos: GrupoConProcedimientosDto[];
}

export class PacienteInfoResponseDto {
  @ApiProperty({ type: PacienteDto })
  @ValidateNested()
  @Type(() => PacienteDto)
  paciente: PacienteDto;

  @ApiProperty({ type: OrdenDto })
  @ValidateNested()
  @Type(() => OrdenDto)
  orden: OrdenDto;
}

export class EstadisticasResponseDto {
  @ApiProperty({ type: EstadisticasResultadosDto })
  @ValidateNested()
  @Type(() => EstadisticasResultadosDto)
  estadisticas: EstadisticasResultadosDto;
}