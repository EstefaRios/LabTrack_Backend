/**
 * Modelos de dominio para el módulo de resultados
 * Estas interfaces representan la estructura de datos del dominio de negocio
 * sin estar acopladas a la base de datos o validaciones de API
 */

// Tipos básicos
export type TipoResultado = 'numerico' | 'opcion' | 'texto' | 'memo';
export type EstadoResultado = 'pendiente' | 'procesado' | 'validado' | 'reportado';
export type EstadoOrden = 'registrada' | 'en_proceso' | 'completada' | 'cancelada';

// Interfaces de dominio
export interface Resultado {
  id: number;
  idOrden: number;
  idProcedimiento: number;
  idPrueba: number;
  idPruebaOpcion?: number;
  resOpcion?: string;
  resNumerico?: number;
  resTexto?: string;
  resMemo?: string;
  numProcesamientos: number;
  valorRefMin?: number;
  valorRefMax?: number;
  fechaResultado?: Date;
  observaciones?: string;
  estado: EstadoResultado;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Prueba {
  id: number;
  codigoPrueba: string;
  nombrePrueba: string;
  unidad?: string;
  idTipoResultado: number;
  valorRefMin?: number;
  valorRefMax?: number;
  metodo?: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface PruebaOpcion {
  id: number;
  idPrueba: number;
  opcion: string;
  valor?: string;
  orden: number;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface TipoResultadoModel {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Procedimiento {
  id: number;
  idCups?: number;
  metodo?: string;
  codigo: string;
  nombre: string;
}

export interface Grupo {
  id: number;
  codigo: string;
  nombre: string;
}

export interface Paciente {
  id: number;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  genero: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  epsNombre?: string;
  epsCodigo?: string;
}

export interface Orden {
  id: number;
  numero: string;
  fecha: Date;
  profesionalExterno?: string;
  estado: EstadoOrden;
  idPaciente: number;
}

// Interfaces compuestas para la lógica de negocio
export interface PruebaConResultado {
  prueba: Prueba;
  resultado: Resultado;
  opciones?: PruebaOpcion[];
}

export interface ProcedimientoConPruebas {
  procedimientoId: number;
  procedimiento: Procedimiento;
  pruebas: PruebaConResultado[];
}

export interface GrupoConProcedimientos {
  grupoId: number;
  grupoCodigo: string;
  grupoNombre: string;
  procedimientos: ProcedimientoConPruebas[];
}

export interface ResultadosCompletos {
  grupos: GrupoConProcedimientos[];
  paciente?: Paciente;
  orden?: Orden;
  estadisticas?: EstadisticasResultados;
}

export interface EstadisticasResultados {
  totalResultados: number;
  totalProcedimientos: number;
  totalGrupos: number;
  resultadosNumericos: number;
  resultadosOpcion: number;
  resultadosTexto: number;
  resultadosMemo: number;
  porcentajeCompletado: number;
}

// Interfaces para consultas y filtros
export interface FiltroResultados {
  idOrden?: number;
  idPaciente?: number;
  fechaDesde?: Date;
  fechaHasta?: Date;
  estado?: EstadoResultado;
  idGrupo?: number;
  idProcedimiento?: number;
}

export interface ParametrosBusqueda {
  filtros: FiltroResultados;
  ordenarPor?: 'fecha' | 'grupo' | 'procedimiento' | 'prueba';
  direccion?: 'ASC' | 'DESC';
  limite?: number;
  offset?: number;
}

// Interfaces para respuestas de servicios
export interface RespuestaServicio<T> {
  exito: boolean;
  datos?: T;
  mensaje?: string;
  error?: string;
  codigo?: number;
}

export interface InfoPacienteYOrden {
  paciente: Paciente;
  orden: Orden;
}

// Tipos de utilidad
export type ResultadoValor = string | number | null;
export type CamposResultado = keyof Resultado;
export type CamposPrueba = keyof Prueba;

// Constantes del dominio
export const TIPOS_RESULTADO = {
  NUMERICO: 1,
  OPCION: 2,
  TEXTO: 3,
  MEMO: 4
} as const;

export const ESTADOS_RESULTADO = {
  PENDIENTE: 'pendiente',
  PROCESADO: 'procesado',
  VALIDADO: 'validado',
  REPORTADO: 'reportado'
} as const;

export const ESTADOS_ORDEN = {
  REGISTRADA: 'registrada',
  EN_PROCESO: 'en_proceso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
} as const;