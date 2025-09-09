import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from '@/models';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    SequelizeModule.forFeature([Category]),
    forwardRef(() => ProductModule),
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
