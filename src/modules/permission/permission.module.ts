import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@/models';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService],
  imports: [SequelizeModule.forFeature([Permission])],
  exports: [PermissionService],
})
export class PermissionModule {}
