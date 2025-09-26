import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FavoriteProduct } from '@/models/favorite-product.model';
import { FavoriteProductService } from './favorite-product.service';
import { FavoriteProductController } from './favorite-product.controller';
import { ProductModule } from '@/modules/product/product.module';
import { ProductVariantModule } from '@/modules/product-variant/product-variant.module';

@Module({
  imports: [
    SequelizeModule.forFeature([FavoriteProduct]),
    ProductModule,
    ProductVariantModule
  ],
  controllers: [FavoriteProductController],
  providers: [FavoriteProductService],
  exports: [FavoriteProductService]
})
export class FavoriteProductModule {}
