import { BigIntDecorator } from '@/common/decorators';

export class UpdateDefaultImageForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @BigIntDecorator('productId', true)
  productId: bigint;
}
