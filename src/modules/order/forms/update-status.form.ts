import {
  BigIntDecorator,
  OrderCmdDecorator,
  StringDecorator
} from '@/common/decorators';

export class UpdateStatusForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @OrderCmdDecorator('cmd', true)
  cmd: string;

  @StringDecorator('rejectReason', false)
  rejectReason?: string;
}
