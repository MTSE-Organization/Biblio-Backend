import { BigIntDecorator } from '@/common/decorators';

export class ViewedProductForm {
  @BigIntDecorator('productId', true)
  productId: bigint;
}
