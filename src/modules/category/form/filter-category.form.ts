import { StringDecorator } from '@/common/decorators';
import { PaginationForm } from '@/common/forms';

export class FilterCategoryForm extends PaginationForm {
  @StringDecorator('name')
  name?: string;
}
