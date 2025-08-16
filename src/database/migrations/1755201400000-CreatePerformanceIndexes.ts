import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePerformanceIndexes1755201400000 implements MigrationInterface {
  name = 'CreatePerformanceIndexes1755201400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Índices para la tabla notification
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_notification_id_usuario_leida_fecha" 
      ON "notification" ("id_usuario", "leida", "fecha_creacion")
    `);
    
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_notification_type_fecha" 
      ON "notification" ("type", "fecha_creacion")
    `);
    
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_notification_leida_fecha" 
      ON "notification" ("leida", "fecha_creacion")
    `);

    // Índices para la tabla audit_log
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_audit_log_created_at_id_usuario" 
      ON "audit_log" ("created_at", "id_usuario")
    `);
    
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_audit_log_table_name_created_at" 
      ON "audit_log" ("table_name", "created_at")
    `);
    
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_audit_log_accion_created_at" 
      ON "audit_log" ("accion", "created_at")
    `);
    
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_audit_log_id_usuario_table_name" 
      ON "audit_log" ("id_usuario", "table_name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar índices de notification
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_notification_id_usuario_leida_fecha"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_notification_type_fecha"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_notification_leida_fecha"`);
    
    // Eliminar índices de audit_log
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_log_created_at_id_usuario"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_log_table_name_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_log_accion_created_at"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_audit_log_id_usuario_table_name"`);
  }
}