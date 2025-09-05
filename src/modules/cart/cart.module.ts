import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AccountModule } from '../account/account.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from '@/models/cart.model';
import { CartItemModule } from '../cart-item/cart-item.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
  imports: [SequelizeModule.forFeature([Cart]), AccountModule, CartItemModule],
})
export class CartModule {}
