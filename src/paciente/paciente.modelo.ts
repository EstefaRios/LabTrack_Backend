import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// gen_m_persona
@Entity('gen_m_persona')
export class Persona {
  @PrimaryGeneratedColumn() id: number;

  @Column({ name: 'id_tipoid' }) idTipoId: number;
  @Column({ name: 'numeroid' }) numeroId: string;

  @Column({ name: 'apellido1' }) apellido1: string;
  @Column({ name: 'apellido2', nullable: true }) apellido2?: string;
  @Column({ name: 'nombre1' }) nombre1: string;
  @Column({ name: 'nombre2', nullable: true }) nombre2?: string;

  @Column({ name: 'fechanac', type: 'date', nullable: true }) fechaNac?: string;
  @Column({ name: 'id_sexobiologico', nullable: true }) idSexoBiologico?: number;

  @Column({ nullable: true }) direccion?: string;
  @Column({ name: 'tel_movil', nullable: true }) telMovil?: string;
  @Column({ nullable: true }) email?: string;
}
