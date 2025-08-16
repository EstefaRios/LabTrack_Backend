import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function buildSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('LabTrack API')
    .setDescription('API para consulta de resultados de laboratorio (Reto SENASOFT)')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  return SwaggerModule.createDocument(app, config);
}
