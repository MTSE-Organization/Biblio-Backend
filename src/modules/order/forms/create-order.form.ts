import { BigIntDecorator, NumberDecorator } from '@/common/decorators';
import { Min } from 'class-validator';

export class CreateOrderForm {
  @BigIntDecorator('productVariantId', true)
  productVariantId: bigint;

  @NumberDecorator('quantity', true)
  @Min(1)
  quantity: number;
}
