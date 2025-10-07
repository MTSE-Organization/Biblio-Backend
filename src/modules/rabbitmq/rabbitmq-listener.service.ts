import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitmqAdminService } from './rabbitmq-admin.service';

@Injectable()
export class RabbitmqListenerService implements OnModuleInit {
  private readonly logger = new Logger(RabbitmqListenerService.name);
  private notificationQueue: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly rabbitMQAdmin: RabbitmqAdminService
  ) {
    this.notificationQueue = this.configService.get<string>(
      'RABBITMQ_NOTIFICATION_QUEUE'
    )!;
  }

  async onModuleInit() {
    // await this.rabbitMQAdmin.listenMessage(
    //   this.notificationQueue,
    //   this.handleNotification.bind(this)
    // );
  }

  // private handleNotification(data: string) {
  //   this.logger.log(
  //     `Processing message from ${this.notificationQueue}: ${data}`
  //   );
  // }
}
