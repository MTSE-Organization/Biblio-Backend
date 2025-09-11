import { Module } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantController } from './product-variant.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductVariant } from '@/models/product-variant.model';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  imports: [SequelizeModule.forFeature([ProductVariant]), ProductModule],
  exports: [ProductVariantService]
})
export class ProductVariantModule {}
