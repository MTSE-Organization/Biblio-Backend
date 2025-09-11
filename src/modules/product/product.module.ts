import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from '@/models/product.model';
import { CategoryModule } from '../category/category.module';
import { PublisherModule } from '../publisher/publisher.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    SequelizeModule.forFeature([Product]),
    forwardRef(() => CategoryModule),
    PublisherModule
  ],
  exports: [ProductService]
})
export class ProductModule {}
