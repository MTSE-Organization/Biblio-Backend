import { BigIntDecorator } from '@/common/decorators';

export class FavoriteProductForm {
  @BigIntDecorator('accountId')
  accountId: bigint;

  @BigIntDecorator('productId', true)
  productId: bigint;

  @BigIntDecorator('productVariantId', true)
  productVariantId: bigint;
}
