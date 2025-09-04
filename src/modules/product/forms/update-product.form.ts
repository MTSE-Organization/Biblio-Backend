import { BigIntDecorator, StringDecorator } from '@/common/decorators';

export class UpdateProductForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('name', true)
  name: string;

  @StringDecorator('description', true)
  description: string;

  @StringDecorator('pCode', true)
  pCode: string;
}
