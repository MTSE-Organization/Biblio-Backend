import { BigIntDecorator, StringDecorator } from '@/common/decorators';

export class RefundOrderForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('refundReason')
  refundReason: string;
}
