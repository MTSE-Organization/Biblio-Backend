import { Injectable } from '@nestjs/common';
import { RabbitmqAdminService } from './rabbitmq-admin.service';
import { BaseSendMsgForm } from './forms/base-send-msg.form';

@Injectable()
export class RabbitmqService {
  constructor(private readonly rabbitMQAdmin: RabbitmqAdminService) {}

  async handleSendMsg(
    appName: string,
    queueName: string,
    data: string,
    cmd: string,
    subCmd: string | null
  ): Promise<void> {
    const form = new BaseSendMsgForm(appName, cmd, subCmd, data);
    const message = JSON.stringify(form);
    await this.rabbitMQAdmin.sendMessage(queueName, message);
  }
}
