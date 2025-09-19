import { Expose } from 'class-transformer';

export class CouponAutoCompleteDto {
  @Expose()
  id: bigint;

  @Expose()
  name: string;

  @Expose()
  code: string;
}
