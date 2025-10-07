import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const rabbitmqConfig: Provider = {
  provide: 'RABBITMQ_CLIENT',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const username = configService.get<string>('RABBITMQ_USERNAME');
    const password = configService.get<string>('RABBITMQ_PASSWORD');
    const host = configService.get<string>('RABBITMQ_HOST');
    const port = configService.get<string>('RABBITMQ_PORT');
    const url = `amqp://${username}:${password}@${host}:${port}`;
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queueOptions: { durable: true }
      }
    });
  }
};
