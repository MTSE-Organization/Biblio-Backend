import { Expose, Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

export class OrderAutoCompleteDto {
  @Expose()
  id: number;

  @Expose()
  accountId: bigint;

  @Expose()
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @Expose()
  currentStatus: number;
}
