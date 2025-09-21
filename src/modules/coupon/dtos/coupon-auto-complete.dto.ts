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
  value: number;

  @Expose()
  minOrderAmount: number;

  @Expose()
  quantity: number;

  @Expose()
  validFrom: Date;

  @Expose()
  validTo: Date;
}
