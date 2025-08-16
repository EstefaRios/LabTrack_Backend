import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ResultadosController } from './resultados.controller';
import { ResultadosService } from './resultados.service';
import {
  ResultadosCompletos,
  InfoPacienteYOrden,
  EstadisticasResultados,
  ESTADOS_RESULTADO,
  TIPOS_RESULTADO
} from './resultados.model';

describe('ResultadosController', () => {
  let controller: ResultadosController;
  let service: ResultadosService;

  const mockResultadosService = {
    getResultadosCompletos: jest.fn(),
    getGruposConResultados: jest.fn(),
    getInfoPacienteYOrden: jest.fn(),
    getEstadisticasResultados: jest.fn(),
    verificarOrden: jest.fn(),
    getInfoPaciente: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResultadosController],
      providers: [
        {
          provide: ResultadosService,
          useValue: mockResultadosService,
        },
      ],
    }).compile();

    controller = module.get<ResultadosController>(ResultadosController);
    service = module.get<ResultadosService>(ResultadosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getResultadosOrden', () => {
    it('should return resultados for a given orden id', async () => {
      const ordenId = 123;
      const expectedResult = {
        grupos: [],
        paciente: null,
        orden: null,
      };

      mockResultadosService.getResultadosCompletos.mockResolvedValue(expectedResult);

      const result = await controller.obtenerResultadosCompletos(ordenId);

      expect(service.getResultadosCompletos).toHaveBeenCalledWith(123);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getGruposConResultados', () => {
    it('should return grupos with resultados for a given orden id', async () => {
      const ordenId = 123;
      const expectedResult = {
        grupos: [{ id: 1, nombre: 'Grupo Test', procedimientos: [] }],
      };

      mockResultadosService.getGruposConResultados.mockResolvedValue(expectedResult);

      const result = await controller.obtenerGruposConResultados(ordenId);

      expect(service.getGruposConResultados).toHaveBeenCalledWith(123);
      expect(result).toEqual(expectedResult);
    });

    it('should throw HttpException when service throws error', async () => {
      const ordenId = 123;
      mockResultadosService.getGruposConResultados.mockRejectedValue(new Error('Database error'));

      await expect(controller.obtenerGruposConResultados(ordenId)).rejects.toThrow(HttpException);
    });
  });

  describe('getInfoPacienteYOrden', () => {
    it('should return patient and orden info for a given orden id', async () => {
      const ordenId = 123;
      const expectedResult = {
        paciente: { id: 1, nombres: 'Juan', apellidos: 'Pérez' },
        orden: { id: 123, numero: 'ORD-123', fecha: '2024-01-01' },
      };

      mockResultadosService.getInfoPacienteYOrden.mockResolvedValue(expectedResult);

      const result = await controller.obtenerInfoPaciente(ordenId);

      expect(service.getInfoPacienteYOrden).toHaveBeenCalledWith(123);
      expect(result).toEqual(expectedResult);
    });

    it('should throw HttpException when service throws error', async () => {
      const ordenId = 123;
      mockResultadosService.getInfoPacienteYOrden.mockRejectedValue(new Error('Database error'));

      await expect(controller.obtenerInfoPaciente(ordenId)).rejects.toThrow(HttpException);
    });
  });

  describe('getEstadisticasResultados', () => {
    it('should return estadisticas for a given orden id', async () => {
      const ordenId = 123;
      const expectedResult = {
        totalPruebas: 10,
        pruebasCompletadas: 8,
        pruebasPendientes: 2,
      };

      mockResultadosService.getEstadisticasResultados.mockResolvedValue(expectedResult);

      const result = await controller.obtenerEstadisticas(ordenId);

      expect(service.getEstadisticasResultados).toHaveBeenCalledWith(123);
      expect(result).toEqual(expectedResult);
    });

    it('should throw HttpException when service throws error', async () => {
      const ordenId = 123;
      mockResultadosService.getEstadisticasResultados.mockRejectedValue(new Error('Database error'));

      await expect(controller.obtenerEstadisticas(ordenId)).rejects.toThrow(HttpException);
    });
  });

  describe('verificarOrden', () => {
    it('should return orden when found', async () => {
      const ordenId = 123;
      const expectedResult = { id: 123, numero: 'ORD-001' };
      mockResultadosService.verificarOrden.mockResolvedValue(expectedResult);

      const result = await controller.verificarOrden(ordenId);

      expect(service.verificarOrden).toHaveBeenCalledWith(123);
      expect(result).toEqual(expectedResult);
    });

    it('should throw HttpException when service throws error', async () => {
      const ordenId = 123;
      mockResultadosService.verificarOrden.mockRejectedValue(new Error('Database error'));

      await expect(controller.verificarOrden(ordenId)).rejects.toThrow(HttpException);
    });
  });
});