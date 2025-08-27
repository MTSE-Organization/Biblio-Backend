import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from '@/models';
import { CategoryMapper } from '@/common/mappers/category.mapper';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryMapper],
  imports: [SequelizeModule.forFeature([Category]), AuthModule],
})
export class CategoryModule {}
