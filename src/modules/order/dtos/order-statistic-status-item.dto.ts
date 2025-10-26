import { Expose } from 'class-transformer';

export class OrderStatisticStatusItemDto {
  @Expose()
  status: number;

  @Expose()
  total: number;

  @Expose()
  percentage: number;
}
