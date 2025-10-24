import { AddressDto } from '@/modules/address/dtos';
import { Expose, Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';
import { OrderStatusDto } from './order-status.dto';
import { CouponAutoCompleteDto } from '@/modules/coupon/dtos';
import { AccountDto } from '@/modules/account/dtos';

export class OrderDto {
  @Expose()
  id: bigint;

  @Expose()
  @Type(() => AccountDto)
  account: AccountDto;

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
  paymentStatus: number;

  @Expose()
  note: string;

  @Expose()
  @Type(() => AddressDto)
  address: AddressDto;

  @Expose()
  @Type(() => CouponAutoCompleteDto)
  coupons: CouponAutoCompleteDto[];

  @Expose()
  deliveryFee: string;

  @Expose()
  total: string;

  @Expose()
  refundReason: string;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;
}
