import { BigIntDecorator } from '@/common/decorators';

export class GetShippingFeeForm {
  @BigIntDecorator('addressId', true)
  addressId: bigint;

  @BigIntDecorator('orderId', true)
  orderId: bigint;
}
