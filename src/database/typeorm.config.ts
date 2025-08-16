import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Persona } from '../paciente/paciente.modelo';
import { ListaOpcion } from '../auth/auth.modelo';
import {
  Tarjetero,
  Documento,
  Orden,
  Procedimiento,
  Grupo,
  Prueba,
  OrdenResultado,
} from '../ordenes/ordenes.modelo';
import { Auditoria } from '../auditoria/auditoria.modelo';
import { Notificacion } from '../notificaciones/notificaciones.modelo';
import { CreatePerformanceIndexes1755201400000 } from './migrations/1755201400000-CreatePerformanceIndexes';

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL, // INTERNAL o EXTERNAL de Render
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  entities: [
    Persona,
    ListaOpcion,
    Tarjetero,
    Documento,
    Orden,
    Procedimiento,
    Grupo,
    Prueba,
    OrdenResultado,
    Auditoria,
    Notificacion,
  ],
  migrations: [CreatePerformanceIndexes1755201400000],
  migrationsRun: false, // correrlas manualmente si las usas
  synchronize: false, // en prod: false
  namingStrategy: new SnakeNamingStrategy(),
  logging: ['error'], // baja el ruido en prod
  extra: { max: 10 }, // pool moderado (plan free)
};
