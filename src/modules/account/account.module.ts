import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from '@/models';
import { GroupModule } from '../group/group.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
  imports: [SequelizeModule.forFeature([Account]), GroupModule],
})
export class AccountModule {}
