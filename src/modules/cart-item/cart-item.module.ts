import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItem } from '@/models/cart-item.model';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
  imports: [SequelizeModule.forFeature([CartItem]), CartModule, ProductModule],
})
export class CartItemModule {}
