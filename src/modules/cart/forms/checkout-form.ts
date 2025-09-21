import { BigIntArrayDecorator, BigIntDecorator } from '@/common/decorators';

export class CheckoutForm {
  @BigIntArrayDecorator('cartItemIds', true, false)
  cartItemIds: bigint[];

  @BigIntDecorator('addressId', false)
  addressId: bigint;

  @BigIntArrayDecorator('couponIds', true)
  couponIds: bigint[];
}
