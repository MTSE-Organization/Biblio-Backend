import { Expose } from 'class-transformer';

export class CouponDto {
  @Expose()
  id: bigint;

  @Expose()
  code: string;

  @Expose()
  kind: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

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
