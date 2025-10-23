import { Expose } from 'class-transformer';

export class RevenueOrderDto {
  @Expose()
  totalRevenue: string;

  @Expose()
  totalOrders: number;
}
