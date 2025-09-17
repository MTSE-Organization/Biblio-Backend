import { Module } from '@nestjs/common';
import { ContributorService } from './contributor.service';
import { AuthorController } from './author.controller';
import { TranslatorController } from './translator.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contributor } from '@/models/contributor.model';
import { FileModule } from '../file/file.module';

@Module({
  controllers: [AuthorController, TranslatorController],
  providers: [ContributorService],
  imports: [SequelizeModule.forFeature([Contributor]), FileModule],
  exports: [ContributorService]
})
export class ContributorModule {}
