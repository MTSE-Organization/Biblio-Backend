import { Body, Controller, Post } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { ConfigService } from '@nestjs/config';

@Controller('rabbitmq')
export class RabbitmqController {
  private notificationQueue: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly rabbitmqService: RabbitmqService
  ) {
    this.notificationQueue = this.configService.get<string>(
      'RABBITMQ_NOTIFICATION_QUEUE'
    )!;
  }

  @Post('send-noti')
  async create(@Body() form) {
    const promises: Promise<void>[] = [];
    for (let i = 0; i <= 100; i++) {
      const data = { index: i, ...form };
      promises.push(
        this.rabbitmqService.handleSendMsg(
          this.notificationQueue,
          JSON.stringify(data)
        )
      );
    }
    await Promise.all(promises);
  }
}
