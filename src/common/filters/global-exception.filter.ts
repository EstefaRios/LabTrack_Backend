import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let error = 'Internal Server Error';

    // Manejo de errores HTTP de NestJS
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || message;
        error = responseObj.error || error;
      }
    }
    // Manejo de errores de base de datos (TypeORM/PostgreSQL)
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      const pgError = exception.driverError as any;
      
      switch (pgError?.code) {
        case '23505': // unique_violation
          message = 'Ya existe un registro con estos datos';
          error = 'Duplicate Entry';
          break;
        case '23503': // foreign_key_violation
          message = 'Referencia a datos inexistentes';
          error = 'Foreign Key Violation';
          break;
        case '23502': // not_null_violation
          message = 'Faltan datos obligatorios';
          error = 'Missing Required Data';
          break;
        case '22001': // string_data_right_truncation
          message = 'Datos demasiado largos para el campo';
          error = 'Data Too Long';
          break;
        case '42P01': // undefined_table
          message = 'Tabla no encontrada en la base de datos';
          error = 'Table Not Found';
          break;
        case '42703': // undefined_column
          message = 'Columna no encontrada en la tabla';
          error = 'Column Not Found';
          break;
        default:
          message = 'Error en la base de datos';
          error = 'Database Error';
          break;
      }
      
      // Log del error completo para debugging
      this.logger.error(
        `Database Error: ${pgError?.code} - ${pgError?.detail || pgError?.message}`,
        exception.stack,
      );
    }
    // Otros errores no controlados
    else {
      this.logger.error(
        `Unhandled Exception: ${exception}`,
        exception instanceof Error ? exception.stack : 'No stack trace',
      );
    }

    // Respuesta estructurada
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    // Log de la respuesta de error (excepto errores 4xx comunes)
    if (status >= 500) {
      this.logger.error(
        `HTTP ${status} Error: ${message}`,
        JSON.stringify(errorResponse),
      );
    }

    response.status(status).json(errorResponse);
  }
}