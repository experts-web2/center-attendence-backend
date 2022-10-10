import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  prepareSwagger(app);
  await app.listen(3000);
}

const prepareSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Attendance API')
    .addTag('Login')
    .setDescription('Sets of endpoints to fetch data from i-attendance-backend')
    .addBearerAuth()
    .build();

  const swaggerOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const documentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, documentOptions);
  SwaggerModule.setup('api', app, document, swaggerOptions);
};
bootstrap();
