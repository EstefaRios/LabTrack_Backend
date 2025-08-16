import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListaAuditoriaQuery {
  @ApiProperty({ required: false, description: 'Número de página (mínimo 1)', default: 1 })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  pagina?: number = 1;

  @ApiProperty({ required: false, description: 'Filtrar por acción (CREATE, UPDATE, DELETE)' })
  @IsString()
  @IsOptional()
  accion?: string;

  @ApiProperty({ required: false, description: 'Filtrar por nombre de tabla' })
  @IsString()
  @IsOptional()
  nombreTabla?: string;

  @ApiProperty({ required: false, description: 'Filtrar por ID de usuario' })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  idUsuario?: number;

  @ApiProperty({ required: false, description: 'Fecha desde (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  desde?: string;

  @ApiProperty({ required: false, description: 'Fecha hasta (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  hasta?: string;

  @ApiProperty({ required: false, description: 'Tamaño de página (máximo 100)', default: 10 })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsOptional()
  limite?: number = 10;
}
