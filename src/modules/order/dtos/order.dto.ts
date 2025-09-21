import { AddressDto } from '@/modules/address/dtos';
import { Expose, Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';
import { OrderStatusDto } from './order-status.dto';
import { Coupon } from '@/models';

export class OrderDto {
  @Expose()
  id: number;

  @Expose()
  accountId: bigint;

  @Expose()
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @Expose()
  @Type(() => OrderStatusDto)
  orderStatuses: OrderStatusDto[];

  @Expose()
  currentStatus: number;

  @Expose()
  paymentMethod: number;

  @Expose()
  note: string;

  @Expose()
  @Type(() => AddressDto)
  address: AddressDto;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  @Type(() => Coupon)
  coupons: Coupon[];
}
