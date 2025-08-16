import { SetMetadata } from '@nestjs/common';

// Tipos de roles disponibles en el sistema
export enum UserRole {
  PACIENTE = 'paciente',
  ADMIN = 'admin',
  MEDICO = 'medico',
  LABORATORIO = 'laboratorio',
}

// Metadata key para el decorator
export const ROLES_KEY = 'roles';

// Decorator para especificar qué roles pueden acceder a un endpoint
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

// Decorator específico para endpoints solo de pacientes
export const PacienteOnly = () => Roles(UserRole.PACIENTE);

// Decorator específico para endpoints de administración
export const AdminOnly = () => Roles(UserRole.ADMIN);

// Decorator para endpoints que requieren roles médicos
export const MedicoOnly = () => Roles(UserRole.MEDICO);

// Decorator para endpoints de laboratorio
export const LaboratorioOnly = () => Roles(UserRole.LABORATORIO);
