import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

import { Category } from '@/models';
import { Product } from '@/models/product.model';

import { AuthModule } from '../auth/auth.module';
import { ProductService } from '../product/product.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, ProductService],
  imports: [SequelizeModule.forFeature([Category, Product]), AuthModule],
  exports: [CategoryService],
})
export class CategoryModule {}
