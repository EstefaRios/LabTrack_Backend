import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad para mapear la tabla de resultados de laboratorio
 */
@Entity('lab_m_resultado')
export class ResultadoLaboratorio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_orden' })
  idOrden: number;

  @Column({ name: 'id_procedimiento' })
  idProcedimiento: number;

  @Column({ name: 'id_prueba' })
  idPrueba: number;

  @Column({ name: 'id_prueba_opcion', nullable: true })
  idPruebaOpcion?: number;

  @Column({ name: 'res_opcion', nullable: true })
  resOpcion?: string;

  @Column({ name: 'res_numerico', type: 'decimal', precision: 10, scale: 4, nullable: true })
  resNumerico?: number;

  @Column({ name: 'res_texto', nullable: true })
  resTexto?: string;

  @Column({ name: 'res_memo', type: 'text', nullable: true })
  resMemo?: string;

  @Column({ name: 'num_procesamientos', default: 0 })
  numProcesamientos: number;

  @Column({ name: 'valor_ref_min', type: 'decimal', precision: 10, scale: 4, nullable: true })
  valorRefMin?: number;

  @Column({ name: 'valor_ref_max', type: 'decimal', precision: 10, scale: 4, nullable: true })
  valorRefMax?: number;

  @Column({ name: 'fecha_resultado', type: 'timestamp', nullable: true })
  fechaResultado?: Date;

  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones?: string;

  @Column({ name: 'estado', default: 'pendiente' })
  estado: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}

/**
 * Entidad para mapear la tabla de pruebas de laboratorio
 */
@Entity('lab_m_prueba')
export class PruebaLaboratorio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo_prueba', unique: true })
  codigoPrueba: string;

  @Column({ name: 'nombre_prueba' })
  nombrePrueba: string;

  @Column({ name: 'unidad', nullable: true })
  unidad?: string;

  @Column({ name: 'id_tipo_resultado' })
  idTipoResultado: number;

  @Column({ name: 'valor_ref_min', type: 'decimal', precision: 10, scale: 4, nullable: true })
  valorRefMin?: number;

  @Column({ name: 'valor_ref_max', type: 'decimal', precision: 10, scale: 4, nullable: true })
  valorRefMax?: number;

  @Column({ name: 'metodo', nullable: true })
  metodo?: string;

  @Column({ name: 'activo', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}

/**
 * Entidad para mapear la tabla de tipos de resultado
 */
@Entity('lab_m_tipo_resultado')
export class TipoResultado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre', unique: true })
  nombre: string;

  @Column({ name: 'descripcion', nullable: true })
  descripcion?: string;

  @Column({ name: 'activo', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}

/**
 * Entidad para mapear la tabla de opciones de prueba
 */
@Entity('lab_m_prueba_opcion')
export class PruebaOpcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_prueba' })
  idPrueba: number;

  @Column({ name: 'opcion' })
  opcion: string;

  @Column({ name: 'valor', nullable: true })
  valor?: string;

  @Column({ name: 'orden', default: 0 })
  orden: number;

  @Column({ name: 'activo', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}

/**
 * Entidad para mapear la vista de resultados completos
 * Esta es una vista que combina información de múltiples tablas
 */
@Entity('v_resultados_completos')
export class VistaResultadosCompletos {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'orden_id' })
  ordenId: number;

  @Column({ name: 'orden_numero' })
  ordenNumero: string;

  @Column({ name: 'fecha_orden' })
  fechaOrden: Date;

  @Column({ name: 'paciente_id' })
  pacienteId: number;

  @Column({ name: 'paciente_nombres' })
  pacienteNombres: string;

  @Column({ name: 'paciente_apellidos' })
  pacienteApellidos: string;

  @Column({ name: 'paciente_documento' })
  pacienteDocumento: string;

  @Column({ name: 'grupo_id' })
  grupoId: number;

  @Column({ name: 'grupo_nombre' })
  grupoNombre: string;

  @Column({ name: 'grupo_codigo' })
  grupoCodigo: string;

  @Column({ name: 'procedimiento_id' })
  procedimientoId: number;

  @Column({ name: 'procedimiento_nombre' })
  procedimientoNombre: string;

  @Column({ name: 'procedimiento_codigo' })
  procedimientoCodigo: string;

  @Column({ name: 'prueba_id' })
  pruebaId: number;

  @Column({ name: 'prueba_nombre' })
  pruebaNombre: string;

  @Column({ name: 'prueba_codigo' })
  pruebaCodigo: string;

  @Column({ name: 'resultado_valor' })
  resultadoValor: string;

  @Column({ name: 'resultado_tipo' })
  resultadoTipo: string;

  @Column({ name: 'fecha_resultado' })
  fechaResultado: Date;

  @Column({ name: 'estado_resultado' })
  estadoResultado: string;
}