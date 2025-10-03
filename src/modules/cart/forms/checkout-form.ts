import { BigIntArrayDecorator } from '@/common/decorators';

export class CheckoutForm {
  @BigIntArrayDecorator('cartItemIds', true, false)
  cartItemIds: bigint[];

  @BigIntArrayDecorator('couponIds', true)
  couponIds: bigint[];
}
