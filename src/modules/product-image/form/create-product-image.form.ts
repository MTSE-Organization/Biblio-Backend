import {
  BigIntDecorator,
  BooleanDecorator,
  StringDecorator
} from '@/common/decorators';
export class CreateProductImageForm {
  @StringDecorator('url', true)
  url: string;

  @BooleanDecorator('isDefault', true)
  isDefault: boolean;

  @BigIntDecorator('productId', true)
  productId: bigint;
}
