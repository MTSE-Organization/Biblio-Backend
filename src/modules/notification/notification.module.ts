import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Notification } from '@/models/notification.model';
import { AccountModule } from '../account/account.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [
    SequelizeModule.forFeature([Notification]),
    forwardRef(() => AccountModule),
    RabbitmqModule
  ],
  exports: [NotificationService]
})
export class NotificationModule {}
