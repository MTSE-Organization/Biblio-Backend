import { Expose } from 'class-transformer';
import { OrderStatisticStatusItemDto } from './order-statistic-status-item.dto';

export class OrderStatisticStatusDto {
  @Expose()
  status: OrderStatisticStatusItemDto[];

  @Expose()
  totalOrders: number;
}
