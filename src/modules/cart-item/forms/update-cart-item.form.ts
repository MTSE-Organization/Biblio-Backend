import { BigIntDecorator, NumberDecorator } from '@/common/decorators';
import { Min } from 'class-validator';

export class UpdateCartItemForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @NumberDecorator('quantity', false)
  @Min(1)
  quantity: number;
}
