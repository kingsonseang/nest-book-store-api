import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Book Store API Documentation') // Updated title
  .setDescription('API documentation...') // Updated description
  .setVersion('1.0')
  .addBearerAuth(
    {
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    },
    'Authorization',
  )
  .addTag('HealthCheck', 'Endpoints to check current service health status.')
  .addTag('Media', 'Endpoints related to media mangement.')
  .addTag('Book', 'Endpoints related to books.')
  .build();
