import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PerfilQuery {
  @ApiProperty() @IsNumberString() personaId: string;
}

export class ListarPacientesQuery {
  @ApiProperty({ required: false, description: 'Número de página (por defecto: 1)' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  pagina?: number;

  @ApiProperty({ required: false, description: 'Límite de resultados por página (por defecto: 50)' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limite?: number;

  @ApiProperty({ required: false, description: 'Búsqueda por nombre, apellido o número de documento' })
  @IsOptional()
  @IsString()
  busqueda?: string;
}
