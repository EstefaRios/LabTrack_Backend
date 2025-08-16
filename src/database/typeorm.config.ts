import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Persona } from '../paciente/paciente.modelo';
import { ListaOpcion } from '../auth/auth.modelo';
import { Tarjetero, Documento, Orden, Procedimiento, Grupo, Prueba, OrdenResultado } from '../ordenes/ordenes.modelo';
import { Auditoria } from '../auditoria/auditoria.modelo';
import { Notificacion } from '../notificaciones/notificaciones.modelo';
import { CreatePerformanceIndexes1755201400000 } from './migrations/1755201400000-CreatePerformanceIndexes';

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USER,
  password: String(process.env.DB_PASS),
  database: process.env.DB_NAME,
  entities: [Persona, ListaOpcion, Tarjetero, Documento, Orden, Procedimiento, Grupo, Prueba, OrdenResultado, Auditoria, Notificacion],
  migrations: [CreatePerformanceIndexes1755201400000],
  migrationsRun: false, // Ejecutar manualmente
  synchronize: false, // ¡NO en prod! Tablas del dump ya existen
  namingStrategy: new SnakeNamingStrategy(),
  logging: ['query', 'error'], // logging temporal para validación
};
