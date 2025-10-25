import { Expose } from 'class-transformer';

export class AccountStatisticDto {
  @Expose()
  totalAccounts: number;
}
