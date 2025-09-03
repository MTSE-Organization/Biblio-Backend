import { StringDecorator, NumberDecorator } from '@/common/decorators';

export class FilterCategoryForm {
  @NumberDecorator('page', false)
  page?: number;

  @NumberDecorator('size', false)
  size?: number;

  @StringDecorator('name', false)
  name?: string;
}
