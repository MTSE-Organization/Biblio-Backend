import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from '@/models';
import { PermissionModule } from '../permission/permission.module';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [SequelizeModule.forFeature([Group]), PermissionModule],
  exports: [GroupService],
})
export class GroupModule {}
