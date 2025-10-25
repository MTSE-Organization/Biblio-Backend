import { Expose } from 'class-transformer';

export class OrderStatisticTypeDto {
  @Expose()
  status: number;

  @Expose()
  name: string;

  @Expose()
  totalOrders: number;
}
