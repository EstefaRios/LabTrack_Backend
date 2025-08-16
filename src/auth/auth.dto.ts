import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginPacienteDto {
  @ApiProperty({ example: 'CC' })
  @IsString()
  @IsNotEmpty()
  tipo: string;
  @ApiProperty({ example: '1000000000' })
  @IsString()
  @IsNotEmpty()
  numero: string;
  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  fechaNacimiento: string;
}
