import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('audit_log') // ← igual a la tabla real
export class Auditoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Index()
  @Column({ name: 'id_usuario', type: 'int', nullable: true })
  idUsuario?: number | null;

  @Column({ name: 'table_name', type: 'text', nullable: true })
  tableName?: string | null;

  @Column({ name: 'record_id', type: 'int', nullable: true })
  recordId?: number | null;

  @Column({ name: 'accion', type: 'text', nullable: true })
  accion?: string | null;

  // JSONs principales del log
  @Column({ name: 'old_data', type: 'jsonb', nullable: true })
  oldData?: any;

  @Column({ name: 'new_data', type: 'jsonb', nullable: true })
  newData?: any;

  // Campos adicionales que existen en tu DB
  @Column({ name: 'ip_address', type: 'text', nullable: true })
  ipAddress?: string | null;

  @Column({ name: 'momento', type: 'timestamptz', default: () => 'now()' })
  momento: Date;

  @Column({ name: 'entidad', type: 'text', nullable: true })
  entidad?: string | null;

  @Column({ name: 'id_entidad', type: 'int', nullable: true })
  idEntidad?: number | null;

  @Column({ name: 'estado_http', type: 'int', nullable: true })
  estadoHttp?: number | null;

  @Column({ name: 'ip', type: 'text', nullable: true })
  ip?: string | null;

  @Column({ name: 'agente_usuario', type: 'text', nullable: true })
  agenteUsuario?: string | null;

  @Column({ name: 'cuerpo', type: 'jsonb', nullable: true })
  cuerpo?: any;

  @Column({ name: 'antes', type: 'jsonb', nullable: true })
  antes?: any;

  @Column({ name: 'despues', type: 'jsonb', nullable: true })
  despues?: any;
}

