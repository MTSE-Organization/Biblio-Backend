import { Injectable } from '@nestjs/common';
import { RabbitmqAdminService } from './rabbitmq-admin.service';

@Injectable()
export class RabbitmqService {
  constructor(private readonly rabbitMQAdmin: RabbitmqAdminService) {}

  async handleSendMsg(queueName: string, data: string): Promise<void> {
    await this.rabbitMQAdmin.sendMessage(queueName, data);
  }
}
