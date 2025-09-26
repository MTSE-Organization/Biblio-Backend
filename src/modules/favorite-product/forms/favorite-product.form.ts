import { BigIntDecorator } from '@/common/decorators';

export class FavoriteProductForm {
  @BigIntDecorator('productId', true)
  productId: bigint;
}
