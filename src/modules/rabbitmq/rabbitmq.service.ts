import { Injectable } from '@nestjs/common';
import { RabbitmqAdminService } from './rabbitmq-admin.service';

@Injectable()
export class RabbitmqService {
  constructor(private readonly rabbitMQAdmin: RabbitmqAdminService) {}

  async handleSendMsg(
    appName: string,
    queueName: string,
    data: any,
    cmd: string,
    subCmd?: string
  ): Promise<void> {
    const form = { app: appName, cmd: cmd, subCmd: subCmd, data: data };
    const message = JSON.stringify(form);
    await this.rabbitMQAdmin.sendMessage(queueName, message);
  }
}
