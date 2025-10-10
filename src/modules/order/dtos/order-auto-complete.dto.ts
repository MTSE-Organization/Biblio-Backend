import { Expose, Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';
import { AccountDto } from '@/modules/account/dtos';

export class OrderAutoCompleteDto {
  @Expose()
  id: bigint;

  @Expose()
  @Type(() => AccountDto)
  account: AccountDto;

  @Expose()
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @Expose()
  total: string;

  @Expose()
  currentStatus: number;

  @Expose()
  paymentMethod: number;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;
}
