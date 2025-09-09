import { BigIntDecorator, NumberDecorator } from '@/common/decorators';
import { Min } from 'class-validator';

export class AddItemForm {
  @BigIntDecorator('cartId', true)
  cartId: bigint;

  @BigIntDecorator('productId', true)
  productId: bigint;

  @NumberDecorator('quantity', false)
  @Min(1)
  quantity: number;
}
