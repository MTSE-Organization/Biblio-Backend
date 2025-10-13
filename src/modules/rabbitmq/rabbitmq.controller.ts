import { Body, Controller, Get, Post } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';

@Controller('rabbitmq')
export class RabbitmqController {
  private notificationQueue: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly rabbitmqService: RabbitmqService,
    private readonly redisService: RedisService
  ) {
    this.notificationQueue = this.configService.get<string>(
      'RABBITMQ_NOTIFICATION_QUEUE'
    )!;
  }

  @Post('send-noti')
  async create(@Body() form) {
    const keysEmp: Set<string> = await this.redisService.getKeysByPrefix('emp');
    console.log(keysEmp);
    const promises: Promise<void>[] = [];
    for (const key of keysEmp) {
      // ${keyType}_${userId}_${sessionId}
      const parts = key.split(':');
      const userId = parts[1];
      const sessionId = parts[2];
      const data = { userId: userId, sessionId: sessionId, message: form };
      promises.push(
        this.rabbitmqService.handleSendMsg(
          'BACKEND_APP',
          this.notificationQueue,
          JSON.stringify(data),
          'CMD_BROADCAST'
        )
      );
    }
    await Promise.all(promises);
  }

  @Get('connect')
  async connect() {
    const promises: Promise<void>[] = [];
    for (let i = 1; i <= 100; i++) {
      const prefix = i <= 50 ? 'emp' : 'usr';
      const key = `${prefix}:${i}`;
      const data = { index: i };
      promises.push(
        this.redisService.set(key, JSON.stringify(data), 5 * 60 * 1000)
      );
    }
    await Promise.all(promises);
    return { message: '100 keys set in Redis with TTL 5 minutes.' };
  }
}
