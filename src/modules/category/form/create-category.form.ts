import { NumberDecorator, StringDecorator } from '@/common/decorators';

export class CreateCategoryForm {
  @StringDecorator('name', true)
  name: string;

  @StringDecorator('description', false)
  description: string;

  @NumberDecorator('status', false)
  status?: number;

  @StringDecorator('imageUrl', false)
  imageUrl?: string;
}
