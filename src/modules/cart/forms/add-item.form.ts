import { BigIntDecorator, NumberDecorator } from '@/common/decorators';
import { Min } from 'class-validator';

export class AddItemForm {
  @BigIntDecorator('productVariantId', true)
  productVariantId: bigint;

  @NumberDecorator('quantity', false)
  @Min(1)
  quantity: number;
}
