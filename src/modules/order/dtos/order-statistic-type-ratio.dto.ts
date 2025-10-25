import { Expose } from 'class-transformer';

export class OrderStatisticTypeRatioDto {
  @Expose()
  status: number;

  @Expose()
  name: string;

  @Expose()
  totalOrdersOfStatus: number;

  @Expose()
  totalOrders: number;

  @Expose()
  percentage: number;
}
