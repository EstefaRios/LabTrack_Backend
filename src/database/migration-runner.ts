import { DataSource } from 'typeorm';
import { typeormConfig } from './typeorm.config';

// Crear DataSource para migraciones
const AppDataSource = new DataSource({
  ...typeormConfig,
  migrationsRun: false, // No ejecutar automáticamente
});

export { AppDataSource };

// Función para ejecutar migraciones manualmente
export async function runMigrations() {
  try {
    console.log('🔄 Inicializando conexión a la base de datos...');
    await AppDataSource.initialize();
    
    console.log('📋 Verificando migraciones pendientes...');
    const pendingMigrations = await AppDataSource.showMigrations();
    
    if (pendingMigrations) {
      console.log('⚠️  Hay migraciones pendientes.');
      console.log('🚀 Ejecutando migraciones...');
      await AppDataSource.runMigrations();
      console.log('✅ Migraciones ejecutadas exitosamente.');
    } else {
      console.log('✅ No hay migraciones pendientes.');
    }
    
    // Mostrar información de migraciones ejecutadas
    const executedMigrations = await AppDataSource.query(
      'SELECT * FROM migrations ORDER BY timestamp DESC LIMIT 5'
    );
    
    console.log('📊 Últimas 5 migraciones ejecutadas:');
    executedMigrations.forEach((migration: any) => {
      console.log(`  - ${migration.name} (${new Date(migration.timestamp).toISOString()})`);
    });
    
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Conexión cerrada.');
    }
  }
}

// Función para revertir la última migración
export async function revertLastMigration() {
  try {
    console.log('🔄 Inicializando conexión a la base de datos...');
    await AppDataSource.initialize();
    
    console.log('⏪ Revirtiendo última migración...');
    await AppDataSource.undoLastMigration();
    console.log('✅ Migración revertida exitosamente.');
    
  } catch (error) {
    console.error('❌ Error revirtiendo migración:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Conexión cerrada.');
    }
  }
}

// Función para verificar el estado de la base de datos
export async function checkDatabaseStatus() {
  try {
    console.log('🔄 Verificando estado de la base de datos...');
    await AppDataSource.initialize();
    
    // Verificar si las tablas principales existen
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('📋 Tablas en la base de datos:');
    tables.forEach((table: any) => {
      console.log(`  - ${table.table_name}`);
    });
    
    // Verificar migraciones ejecutadas
    const migrationsTableExists = tables.some((table: any) => table.table_name === 'migrations');
    
    if (migrationsTableExists) {
      const migrations = await AppDataSource.query(
        'SELECT name, timestamp FROM migrations ORDER BY timestamp'
      );
      
      console.log('\n🗂️  Migraciones ejecutadas:');
      if (migrations.length === 0) {
        console.log('  - Ninguna migración ejecutada aún');
      } else {
        migrations.forEach((migration: any) => {
          console.log(`  - ${migration.name} (${new Date(migration.timestamp).toISOString()})`);
        });
      }
    } else {
      console.log('\n⚠️  Tabla de migraciones no existe. Base de datos sin inicializar.');
    }
    
    return {
      tablesCount: tables.length,
      migrationsExecuted: migrationsTableExists ? await AppDataSource.query('SELECT COUNT(*) as count FROM migrations') : [{ count: 0 }],
      hasMigrationsTable: migrationsTableExists
    };
    
  } catch (error) {
    console.error('❌ Error verificando estado de la base de datos:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'run':
      runMigrations().catch(console.error);
      break;
    case 'revert':
      revertLastMigration().catch(console.error);
      break;
    case 'status':
      checkDatabaseStatus().catch(console.error);
      break;
    default:
      console.log('Uso: npm run migration [run|revert|status]');
      console.log('  run    - Ejecutar migraciones pendientes');
      console.log('  revert - Revertir última migración');
      console.log('  status - Verificar estado de la base de datos');
  }
}