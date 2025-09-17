import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Publisher } from '@/models/publisher.model';
import { FileModule } from '../file/file.module';

@Module({
  controllers: [PublisherController],
  providers: [PublisherService],
  imports: [SequelizeModule.forFeature([Publisher]), FileModule],
  exports: [PublisherService]
})
export class PublisherModule {}
