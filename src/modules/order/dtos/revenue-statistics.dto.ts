import { Expose, Type } from 'class-transformer';

export class RevenueStatisticItemDto {
  @Expose()
  date: string;

  @Expose()
  total: string;
}

export class RevenueStatisticDto {
  @Expose()
  @Type(() => RevenueStatisticItemDto)
  items: RevenueStatisticItemDto[];
}
