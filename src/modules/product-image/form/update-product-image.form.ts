import {
  BigIntDecorator,
  NumberDecorator,
  StringDecorator,
  BooleanDecorator,
} from '@/common/decorators';

export class UpdateProductImageForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('url', true)
  url: string;

  @NumberDecorator('ordering', true)
  ordering: number;

  @BooleanDecorator('isDefault', true)
  isDefault: boolean;
}
