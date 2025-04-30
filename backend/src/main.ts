import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as userAgent from 'express-useragent';

async function bootstrap() {
  dotenv.config(); // cargar .env
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Habilitar CORS
  app.enableCors({
    origin: '*', // Puedes especificar el origen que desees permitir, por ejemplo, ['http://localhost:4200']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Prefix
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.use(userAgent.express());
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema POS')
    .setDescription('SISTEMA POS API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
