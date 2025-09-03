import {
  BigIntDecorator,
  NumberDecorator,
  StringDecorator,
} from '@/common/decorators';

export class UpdateCategoryForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('name', false)
  name?: string;

  @StringDecorator('slug', false)
  slug?: string;

  @StringDecorator('description', false)
  description?: string;

  @NumberDecorator('ordering', false)
  ordering?: number;

  @NumberDecorator('status', false)
  status?: number;
}
