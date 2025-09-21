import { BigIntDecorator } from '@/common/decorators';
import { OrderStatusDecorator } from '@/common/decorators/order-status.decorator';

export class UpdateStatusForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @OrderStatusDecorator('status', true)
  status: number;
}
