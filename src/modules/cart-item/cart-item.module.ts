import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItem } from '@/models/cart-item.model';
import { ProductVariantModule } from '../product-variant/product-variant.module';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
  imports: [SequelizeModule.forFeature([CartItem]), ProductVariantModule]
})
export class CartItemModule {}
