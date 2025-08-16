import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// fac_m_tarjetero
@Entity('fac_m_tarjetero')
export class Tarjetero {
  @PrimaryGeneratedColumn() id: number;
  @Column() historia: string;
  @Column({ name: 'id_persona' }) idPersona: number;
  @Column({ name: 'id_regimen' }) idRegimen: number;
  @Column({ name: 'id_eps', nullable: true }) idEps?: number;
  @Column({ name: 'id_nivel', nullable: true }) idNivel?: number;
}

// gen_p_documento
@Entity('gen_p_documento')
export class Documento {
  @PrimaryGeneratedColumn() id: number;
  @Column() codigo: string;
  @Column() nombre: string;
}

// lab_m_orden
@Entity('lab_m_orden')
export class Orden {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'id_documento', nullable: true }) idDocumento?: number;
  @Column({ type: 'numeric', precision: 10, scale: 0 }) orden: string;
  @Column({ type: 'timestamp' }) fecha: Date;
  @Column({ name: 'id_historia', nullable: true }) idHistoria?: number;
  @Column({ name: 'id_profesional_ordena', nullable: true })
  idProfesional?: number;
  @Column({ name: 'profesional_externo', default: false })
  profesionalExterno: boolean;
}

// lab_p_grupos
@Entity('lab_p_grupos')
export class Grupo {
  @PrimaryGeneratedColumn() id: number;
  @Column() codigo: string;
  @Column() nombre: string;
}

// lab_p_procedimientos
@Entity('lab_p_procedimientos')
export class Procedimiento {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'id_cups' }) idCups: number;
  @Column({ name: 'id_grupo_laboratorio' }) idGrupo: number;
  @Column({ nullable: true }) metodo?: string;
}

// lab_p_pruebas
@Entity('lab_p_pruebas')
export class Prueba {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'id_procedimiento' }) idProcedimiento: number;
  @Column({ name: 'codigo_prueba' }) codigoPrueba: string;
  @Column({ name: 'nombre_prueba' }) nombrePrueba: string;
  @Column({ name: 'id_tipo_resultado' }) idTipoResultado: number;
  @Column({ nullable: true }) unidad?: string;
}

// lab_m_orden_resultados
@Entity('lab_m_orden_resultados')
export class OrdenResultado {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'timestamp' }) fecha: Date;
  @Column({ name: 'id_orden' }) idOrden: number;
  @Column({ name: 'id_procedimiento' }) idProcedimiento: number;
  @Column({ name: 'id_prueba' }) idPrueba: number;
  @Column({ name: 'id_pruebaopcion', nullable: true }) idPruebaOpcion?: number;
  @Column({ name: 'res_opcion', nullable: true }) resOpcion?: string;
  @Column({ name: 'res_numerico', nullable: true }) resNumerico?: string;
  @Column({ name: 'res_texto', nullable: true }) resTexto?: string;
  @Column({ name: 'res_memo', nullable: true }) resMemo?: string;
  @Column({ name: 'num_procesamientos', nullable: true })
  numProcesamientos?: number;
}

// Tipo para compatibilidad con consultas existentes
export type OrdenResultadoRaw = {
  id: number;
  fecha: string;
  id_orden: number;
  id_procedimiento: number;
  id_prueba: number;
  id_pruebaopcion?: number;
  res_opcion?: string;
  res_numerico?: string;
  res_texto?: string;
  res_memo?: string;
  num_procesamientos?: number;
};
