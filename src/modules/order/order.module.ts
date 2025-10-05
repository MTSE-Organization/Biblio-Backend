import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order, OrderItem, OrderStatus } from '@/models';
import { OrderItemService } from './order-item.service';
import { OrderStatusService } from './order-status.service';
import { AccountModule } from '../account/account.module';
import { AddressModule } from '../address/address.module';
import { ProductVariantModule } from '../product-variant/product-variant.module';
import { CartItemModule } from '../cart-item/cart-item.module';
import { CouponModule } from '../coupon/coupon.module';
import { OrderScheduler } from './order.scheduler';
import { ProductModule } from '../product/product.module';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderItemService,
    OrderStatusService,
    OrderScheduler
  ],
  imports: [
    SequelizeModule.forFeature([Order, OrderItem, OrderStatus]),
    forwardRef(() => AccountModule),
    forwardRef(() => AddressModule),
    ProductVariantModule,
    CartItemModule,
    CouponModule,
    ProductModule
  ],
  exports: [OrderService, OrderItemService]
})
export class OrderModule {}
