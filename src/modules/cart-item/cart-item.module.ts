import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { ProductModule } from '../product/product.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItem } from '@/models/cart-item.model';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
  imports: [SequelizeModule.forFeature([CartItem]), ProductModule],
})
export class CartItemModule {}
