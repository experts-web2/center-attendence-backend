import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

async function bootstrap() {
  const adminConfig: any = {
    project_id: 'attendence-6059d',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCVPluDMIuap409\noyEX3P3guu0VEUm1fr2jrCJzOfZnItuxZIVWdxiZmMq4fRXKEnIHkG/uVvgMe5Gn\nHJtgACmT+zquUaCF3OEl4YwCyG91jRt2fAWgWDUt04hs2JCAb5oyYNtA/R1pDeRL\n5nxqj+TvIWJAlhllGXiPZrXVLBtOHrit6SwneeMsM2KItCSDjUdwg8CoJU8JDms7\nb8LebpJ4SQiuNYya602iWtdzJS5zZ/UZ8h9ttqstBcUG1Nuz7hTi2pXG/y+zCaJs\nse4Xzvpj/3R0vSUxoSyLSwM6QBpo6M+zBS8qC91Hu47xelfn1Hq23LYp1cOPtFC0\nKst1BfyPAgMBAAECggEAQ0WhcGggdWzTIJZ4o04M7hC0L0vkorfneXBs8u2MoP64\ncqSx6cCzSQDzV+eiO7zGw5waqB9xngbRJ7egXcyU8UxMLilDJzPiFPYu604314/s\nciMDUjyQdACmvRF9STeFFPJNwmSVrjYB0yioqkwEULoGlMBT4Bt0GYedrOI9yJ8l\n249eQaOn7fZnUcna6+QRHWXf8YCTg4qm5nYQV9SVLiVTyjygu0dtBzIrAuCkazkx\nHdFILYqsn6b8+fMfFevj75ETChoW3NbNWYQyAgrDxCTJPVq9+DXhuaK3sfel4o5H\nffHgshejs4351ZoGgsUEJMBV74sX9zSx1RpqkQTuUQKBgQDQ3Yf3jO/Yu8eqJeT4\nH4sK2XKA0olYDFore/x9cGrDTmTxZPOSAI//RQ8I9MZMr6Fdtkr/L4vriLweq44H\ng45BmKS/Zy0RqEYBwVkT3b0iFZMJwHC+Z455J+Z7Te737RuWCtDcE+iuYJxquc6b\nRNjlD1ae7bOHDvjH6m/1EQUVpwKBgQC27GLRpb65guttcQCmUE+qqR5boaTUc9DV\nhR7J8PddaI77xpA3ExbDwZxzK/gpgtYyHE2HbfPA036MwglM7k43qc3S4WJEQC8O\nsqFhtTJ022VcA6t2wJx0bQRGk3z+hKyUjU1a171pk/4EVtWwB44MT2nIKwbmTOMl\nW2JuOyyO2QKBgQC0llXxG9JkujcwTgNi5SL7BneSGnbVwhhUcKcmbgRhSW7NqFNQ\ncVwPgk41mC28MD59IBhH+3wm8dp1Si9LH9vnq2sGctbs5WliKyIxow7cYXr4e4L/\nndn5tx34jrGHe2LWoBNltXEBFFcpj+2rIiPGKTTjxPHsXG2NrI2Qfl6/EQKBgQCE\n8ITc0jUrQ19wGTkcpa9QWzpJ488T69uw4d8/ahWMWCnaBzPWItRfjjzyYtkm6gRb\nRMB/lUQaNlp5V6dEtsg3ofuIr+4npfHNH7szdGloDe67EZuyYUcTQgtic1va6Xc3\nOv4l8DajHT/1zVndZZAxmCFLrSGFjAlko+aEMBMw+QKBgQCN2HZ94KC49OSp8NqB\nCHBC6NR9PNDQREnuLMgQSA6K8v0O0AkGPNRFm272jLS7d94CzHrbDHC7YBCdkq00\njrI8WRX/6/5d62Msl7DqZHolOAtuZoYNL5F6Y5X/ZAXn/ZmphiO4RtXnGtQHeV5d\nGLsiVTlJ/AUfLuRM26Qa4WeV0g==\n-----END PRIVATE KEY-----\n'.replace(
      /\\n/g,
      '\n',
    ),
    client_email:
      'firebase-adminsdk-lsivd@attendence-6059d.iam.gserviceaccount.com',
  };
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lsivd%40attendence-6059d.iam.gserviceaccount.com',
  });

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  prepareSwagger(app);
  await app.listen(3001);
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
