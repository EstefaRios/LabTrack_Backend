import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsDateString } from 'class-validator';

export class ListarOrdenesQuery {
  @ApiProperty() @IsNumberString() personaId: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  pagina?: string;
  @ApiProperty({ required: false }) @IsOptional() busca?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  desde?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  hasta?: string;
  @ApiProperty({ required: false, description: '1=ASC, 0=DESC' })
  @IsOptional()
  asc?: string;
}
