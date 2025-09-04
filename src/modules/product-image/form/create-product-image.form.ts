import {
  BigIntDecorator,
  BooleanDecorator,
  NumberDecorator,
  StringDecorator,
} from '@/common/decorators';
export class CreateProductImageForm {
  @StringDecorator('url', false)
  url?: string;

  @NumberDecorator('ordering', false)
  ordering?: number;

  @BooleanDecorator('isDefault', true)
  isDefault: boolean;

  @BigIntDecorator('productId', true)
  productId: bigint;
}
