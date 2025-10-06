import { AccountShortDto } from '@/modules/account/dtos';
import { Expose, Type } from 'class-transformer';

export class ReviewDto {
  @Expose()
  id: bigint;

  @Expose()
  productId: bigint;

  @Expose()
  @Type(() => AccountShortDto)
  account: AccountShortDto;

  @Expose()
  rate: number;

  @Expose()
  content: string;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
