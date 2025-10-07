import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqController } from './rabbitmq.controller';
import { RabbitmqAdminService } from './rabbitmq-admin.service';
import { RabbitmqListenerService } from './rabbitmq-listener.service';

@Module({
  controllers: [RabbitmqController],
  providers: [RabbitmqAdminService, RabbitmqService, RabbitmqListenerService],
  exports: [RabbitmqService]
})
export class RabbitmqModule {}
