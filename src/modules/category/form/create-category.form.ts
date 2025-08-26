import { NumberDecorator, StringDecorator } from '@/common/decorators';

export class CreateCategoryForm {
  @StringDecorator('name', true)
  name: string;

  @StringDecorator('slug', true)
  slug: string;

  @StringDecorator('description', false)
  description: string;

  @NumberDecorator('ordering', false)
  ordering?: number;

  @NumberDecorator('status', false)
  status?: number;
}
