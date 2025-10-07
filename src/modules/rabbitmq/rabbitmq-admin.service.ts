import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger
} from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitmqAdminService implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.Channel;
  private connection: amqp.Connection;
  private readonly logger = new Logger(RabbitmqAdminService.name);

  private username: string;
  private password: string;
  private host: string;
  private port: string;
  private notificationQueue: string;

  constructor(private readonly configService: ConfigService) {
    this.username = this.configService.get<string>('RABBITMQ_USERNAME')!;
    this.password = this.configService.get<string>('RABBITMQ_PASSWORD')!;
    this.host = this.configService.get<string>('RABBITMQ_HOST')!;
    this.port = this.configService.get<string>('RABBITMQ_PORT')!;
    this.notificationQueue = this.configService.get<string>(
      'RABBITMQ_NOTIFICATION_QUEUE'
    )!;
  }

  // On module initialization, we will connect to RabbitMQ
  async onModuleInit() {
    await this.connectToRabbitMQ();
  }

  // On module shutdown, we will gracefully close the connection and channel
  async onModuleDestroy() {
    await this.closeConnection();
  }

  // Establish connection to RabbitMQ and create a channel
  async connectToRabbitMQ() {
    try {
      const url = `amqp://${this.username}:${this.password}@${this.host}:${this.port}`;

      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      await this.createQueueIfNotExist(this.notificationQueue);
      this.logger.log('Connected to RabbitMQ and created the channel');

      // Start listening for messages
      // this.listenForMessages();
    } catch (error) {
      this.logger.error('Error connecting to RabbitMQ:', error);
      // process.exit(1);
    }
  }

  // Send a message via the manually created channel
  async sendMessage(queueName: string, data: string) {
    try {
      // connect if not exist
      if (!this.channel) {
        await this.connectToRabbitMQ();
      }

      // create queue if not exist
      await this.createQueueIfNotExist(queueName);

      const messageBuffer = Buffer.from(data);
      this.channel.sendToQueue(queueName, messageBuffer, {
        persistent: true
      });
      this.logger.log(`Message sent to queue ${queueName}: ${data}`);
    } catch (error) {
      this.logger.error('Error sending message to RabbitMQ:', error);
    }
  }

  // Listen a message from queue
  async listenMessage(
    queueName: string,
    callback: (data: string) => void
  ): Promise<void> {
    if (!this.channel) {
      await this.connectToRabbitMQ();
    }

    await this.createQueueIfNotExist(queueName);

    await this.channel.consume(queueName, (msg) => {
      if (msg) {
        const content = msg.content.toString();
        this.logger.log(`Message received from ${queueName}: ${content}`);
        try {
          callback(content);
          this.channel.ack(msg);
        } catch (err) {
          this.logger.error(`Error in callback for queue ${queueName}:`, err);
          this.channel.nack(msg, false, false); // not requeue
        }
      }
    });
  }

  async isQueueExist(queueName: string): Promise<boolean> {
    try {
      await this.channel.checkQueue(queueName);
      return true;
    } catch (e) {
      return false;
    }
  }

  async createQueueIfNotExist(queueName: string): Promise<void> {
    const exists = await this.isQueueExist(queueName);
    if (!exists) {
      this.logger.log(`-------> Create queue name: ${queueName}`);
      await this.channel.assertQueue(queueName, { durable: true });
    }
  }

  // Gracefully close the RabbitMQ connection and channel
  async closeConnection() {
    try {
      if (this.channel) {
        await this.channel.close();
        this.logger.log('Channel closed');
      }
      if (this.connection) {
        await this.connection.close();
        this.logger.log('RabbitMQ connection closed');
      }
    } catch (error) {
      this.logger.error('Error closing RabbitMQ connection:', error);
    }
  }
}
