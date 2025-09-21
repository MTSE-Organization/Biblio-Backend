import {
  StringDecorator,
  NumberDecorator,
  BigIntDecorator
} from '@/common/decorators';

export class UpdateCouponForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('code', true)
  code: string;

  @NumberDecorator('kind', true)
  kind: number;

  @StringDecorator('name', true)
  name: string;

  @StringDecorator('description', true)
  description: string;

  @NumberDecorator('type')
  type: number;

  @NumberDecorator('value', true)
  value: number;

  @NumberDecorator('minOrderAmount')
  minOrderAmount: number;

  @NumberDecorator('quantity', true)
  quantity: number;

  @StringDecorator('validFrom', true)
  validFrom: Date;

  @StringDecorator('validTo', true)
  validTo: Date;
}
