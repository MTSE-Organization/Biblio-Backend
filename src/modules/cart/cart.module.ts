import { forwardRef, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AccountModule } from '../account/account.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from '@/models/cart.model';
import { CartItemModule } from '../cart-item/cart-item.module';
import { OrderModule } from '../order/order.module';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
  imports: [
    SequelizeModule.forFeature([Cart]),
    forwardRef(() => AccountModule),
    CartItemModule,
    OrderModule
  ]
})
export class CartModule {}
