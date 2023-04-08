import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { connect, Channel, Connection } from 'amqplib';
import 'dotenv/config';

@Injectable()
export class RabbitmqService {
  private readonly producer: ClientProxy;

  constructor() {
    this.producer = ClientProxyFactory.create({
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
    });
  }

  async sendMessageToServiceB(message: any) {
    await this.producer.send('queue-b', message).toPromise();
  }
}
