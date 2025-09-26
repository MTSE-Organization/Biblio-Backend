import { Module } from '@nestjs/common';
import { ViewedProductService } from './viewed-product.service';
import { ViewedProductController } from './viewed-product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ViewedProduct } from '@/models/viewed-product.model';
import { ProductModule } from '@/modules/product/product.module';

@Module({
  imports: [SequelizeModule.forFeature([ViewedProduct]), ProductModule],
  controllers: [ViewedProductController],
  providers: [ViewedProductService],
  exports: [ViewedProductService]
})
export class ViewedProductModule {}
