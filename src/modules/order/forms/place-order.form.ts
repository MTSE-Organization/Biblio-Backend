import {
  BigIntArrayDecorator,
  BigIntDecorator,
  PaymentMethodDecorator,
  StringDecorator
} from '@/common/decorators';

export class PlaceOrderForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @BigIntDecorator('addressId', true)
  addressId: bigint;

  @BigIntArrayDecorator('couponIds', true)
  couponIds: bigint[];

  @PaymentMethodDecorator('paymentMethod', true)
  paymentMethod: number;

  @StringDecorator('note', false)
  note: string;
}
