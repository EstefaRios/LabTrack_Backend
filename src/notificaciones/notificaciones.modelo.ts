import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('notification') // ← igual a la tabla real
export class Notificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'id_usuario', type: 'int' })
  idUsuario: number;

  @Column({ name: 'type', type: 'varchar', length: 32, default: 'info' })
  type: string;

  @Column({ name: 'titulo', type: 'varchar', length: 200 })
  titulo: string;

  @Column({ name: 'mensaje', type: 'text' })
  mensaje: string;

  @Column({ name: 'data', type: 'jsonb', nullable: true })
  data?: Record<string, any>;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Index()
  @Column({ name: 'leida', type: 'boolean', default: false })
  leida: boolean;

  @Index()
  @Column({
    name: 'fecha_creacion',
    type: 'timestamptz',
    default: () => 'now()',
  })
  fechaCreacion: Date;

  @Column({ name: 'fecha_lectura', type: 'timestamptz', nullable: true })
  fechaLectura?: Date | null;
}
