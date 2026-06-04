import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // Helmet - headers de seguridad HTTP
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:19000', '*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Bachillero API')
    .setDescription('API para el sistema de reciclaje y premiación estudiantil')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`🚀 Servidor corriendo en http://localhost:${port}/api`);
  Logger.log(`📚 Documentación en http://localhost:${port}/api/docs`);
}
bootstrap();