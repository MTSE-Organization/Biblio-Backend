import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart, Order, OrderItem, OrderStatus } from '@/models';
import { OrderItemService } from './order-item.service';
import { OrderStatusService } from './order-status.service';
import { AccountModule } from '../account/account.module';
import { AddressModule } from '../address/address.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { CartItemModule } from '../cart-item/cart-item.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderItemService, OrderStatusService],
  imports: [
    SequelizeModule.forFeature([Order, OrderItem, OrderStatus]),
    forwardRef(() => AccountModule),
    AddressModule,
    ProductVariantModule,
    CartItemModule
  ],
  exports: [OrderService]
})
export class OrderModule {}
