import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from '@/models';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [SequelizeModule.forFeature([Category]), AuthModule],
})
export class CategoryModule {}
