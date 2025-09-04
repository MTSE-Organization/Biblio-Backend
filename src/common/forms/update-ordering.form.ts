import { BigIntDecorator, NumberDecorator } from '@/common/decorators';

export class UpdateOrderingForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @NumberDecorator('ordering', true)
  ordering: number;
}
