import { BigIntDecorator } from '@/common/decorators';
import { PaginationForm } from '@/common/forms';

export class FilterProductImageForm extends PaginationForm {
  @BigIntDecorator('productId', true)
  productId: bigint;
}
