import { Expose, Type } from 'class-transformer';
import { OrderStatisticStatusItemDto } from './order-statistic-status-item.dto';

export class OrderStatisticStatusDto {
  @Expose()
  @Type(() => OrderStatisticStatusItemDto)
  status: OrderStatisticStatusItemDto[];

  @Expose()
  totalOrders: number;
}
