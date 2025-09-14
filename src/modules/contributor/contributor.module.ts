import { Module } from '@nestjs/common';
import { ContributorService } from './contributor.service';
import { AuthorController } from './author.controller';
import { TranslatorController } from './translator.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Contributor } from '@/models/contributor';

@Module({
  controllers: [AuthorController, TranslatorController],
  providers: [ContributorService],
  imports: [SequelizeModule.forFeature([Contributor])],
  exports: [ContributorService]
})
export class ContributorModule {}
