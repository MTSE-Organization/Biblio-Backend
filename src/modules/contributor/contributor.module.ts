import { Module } from '@nestjs/common';
import { ContributorService } from './contributor.service';
import { ContributorController } from './contributor.controller';

@Module({
  controllers: [ContributorController],
  providers: [ContributorService],
})
export class ContributorModule {}
