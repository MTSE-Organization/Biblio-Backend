import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Publisher } from '@/models/publisher';

@Module({
  controllers: [PublisherController],
  providers: [PublisherService],
  imports: [SequelizeModule.forFeature([Publisher])],
  exports: [PublisherService]
})
export class PublisherModule {}
