import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExceptionLoggerFilter } from './utils/exceptionLogger.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new ExceptionLoggerFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();

async function bootstrapRB() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}`,
        ],
        queue: process.env.RABBITMQ_QUEUE_NAME,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
}
bootstrapRB();
