import { Expose, Type } from 'class-transformer';

export class AccountDailyStatisticDtoItem {
  @Expose()
  date: string;

  @Expose()
  total: number;
}

export class AccountDailyStatisticDto {
  @Expose()
  @Type(() => AccountDailyStatisticDtoItem)
  items: AccountDailyStatisticDtoItem[];
}
