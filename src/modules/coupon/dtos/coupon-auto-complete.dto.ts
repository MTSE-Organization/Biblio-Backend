import { Expose } from 'class-transformer';

export class CouponAutoCompleteDto {
  @Expose()
  id: bigint;

  @Expose()
  code: string;

  @Expose()
  kind: number;

  @Expose()
  name: string;

  @Expose()
  type: number;

  @Expose()
  value: string;

  @Expose()
  minOrderAmount: string;

  @Expose()
  quantity: number;

  @Expose()
  validFrom: Date;

  @Expose()
  validTo: Date;
}
