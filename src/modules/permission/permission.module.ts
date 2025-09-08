import { forwardRef, Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@/models';
import { PermissionGroupModule } from '../permission-group/permission-group.module';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  imports: [
    SequelizeModule.forFeature([Permission]),
    forwardRef(() => PermissionGroupModule),
  ],
  exports: [PermissionService],
})
export class PermissionModule {}
