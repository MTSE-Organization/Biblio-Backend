import { forwardRef, Module } from '@nestjs/common';
import { PermissionGroupService } from './permission-group.service';
import { PermissionGroupController } from './permission-group.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PermissionGroup } from '@/models/permission-group.model';
import { PermissionModule } from '../permission/permission.module';

@Module({
  controllers: [PermissionGroupController],
  providers: [PermissionGroupService],
  imports: [
    SequelizeModule.forFeature([PermissionGroup]),
    forwardRef(() => PermissionModule),
  ],
  exports: [PermissionGroupService],
})
export class PermissionGroupModule {}
