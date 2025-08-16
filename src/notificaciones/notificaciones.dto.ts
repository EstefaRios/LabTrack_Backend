import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CrearNotificacionDto {
  @ApiProperty() @IsInt() idUsuario: number;
  @ApiProperty({ default: 'info' }) @IsString() @IsOptional() tipo?: string;
  @ApiProperty() @IsString() @IsNotEmpty() titulo: string;
  @ApiProperty() @IsString() @IsNotEmpty() mensaje: string;
  @ApiProperty({ required: false, description: 'JSON libre' })
  @IsOptional()
  datos?: any;
}

export class ListarNotificacionesQuery {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  idUsuario: number;

  @ApiProperty({ required: false })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  soloNoLeidas?: boolean;

  @ApiProperty({ required: false })
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  pagina?: number;

  @ApiProperty({
    required: false,
    description: 'Filtrar por tipo de notificación',
  })
  @IsString()
  @IsOptional()
  tipo?: string;

  @ApiProperty({ required: false, description: 'Fecha desde (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  desde?: string;

  @ApiProperty({ required: false, description: 'Fecha hasta (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  hasta?: string;
}

export class MarcarLeidaDto {
  @ApiProperty() @IsBoolean() leida: boolean;
}

export class ActualizarNotificacionDto extends PartialType(
  CrearNotificacionDto,
) {}
