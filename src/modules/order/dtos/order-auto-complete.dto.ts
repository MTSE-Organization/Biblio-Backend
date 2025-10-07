import { Expose, Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

export class OrderAutoCompleteDto {
  @Expose()
  id: bigint;

  @Expose()
  accountId: bigint;

  @Expose()
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @Expose()
  total: string;

  @Expose()
  currentStatus: number;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;
}
