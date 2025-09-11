import { PaginationForm } from '@/common/forms';
import { StringDecorator } from '@/common/decorators';

export class FilterPublisherForm extends PaginationForm {
  @StringDecorator('name')
  name?: string;
}
