import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from '@/models';
import { Product } from '@/models/product.model';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    SequelizeModule.forFeature([Category, Product]),
    AuthModule,
    forwardRef(() => ProductModule),
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
