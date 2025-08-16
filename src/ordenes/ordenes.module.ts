import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';
import { Orden, Tarjetero, Procedimiento, Grupo, Prueba, OrdenResultado } from './ordenes.modelo';
import { Persona } from '../paciente/paciente.modelo';
import { ResultadosModule } from '../resultados/resultados.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Orden, Tarjetero, Procedimiento, Grupo, Prueba, OrdenResultado, Persona]),
    ResultadosModule,
  ],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}
