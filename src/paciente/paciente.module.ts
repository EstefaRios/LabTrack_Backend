import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteController } from './paciente.controller';
import { PacienteService } from './paciente.service';
import { Persona } from './paciente.modelo';

@Module({
  imports: [TypeOrmModule.forFeature([Persona])],
  controllers: [PacienteController],
  providers: [PacienteService],
})
export class PacienteModule {}
