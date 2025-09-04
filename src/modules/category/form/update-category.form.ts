import {
  BigIntDecorator,
  NumberDecorator,
  StringDecorator,
} from '@/common/decorators';

export class UpdateCategoryForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('name', true)
  name: string;

  @StringDecorator('description', false)
  description?: string;

  @NumberDecorator('ordering', true)
  ordering: number;

  @NumberDecorator('status', true)
  status: number;

  @StringDecorator('slug', false)
  slug?: string;

  @StringDecorator('imageUrl', false)
  imageUrl?: string;
}
