import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultadosController } from './resultados.controller';
import { ResultadosService } from './resultados.service';

@Module({
  imports: [
    // TypeOrmModule se configura para usar DataSource inyectado
    TypeOrmModule.forFeature([]),
  ],
  controllers: [ResultadosController],
  providers: [ResultadosService],
  exports: [ResultadosService],
})
export class ResultadosModule {}