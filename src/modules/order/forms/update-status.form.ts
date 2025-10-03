import { BigIntDecorator, OrderCmdDecorator } from '@/common/decorators';

export class UpdateStatusForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @OrderCmdDecorator('cmd', true)
  cmd: string;
}
