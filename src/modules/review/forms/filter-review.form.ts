import { PaginationForm } from '@/common/forms';
import { BigIntDecorator } from '@/common/decorators';

export class FilterReviewForm extends PaginationForm {
  @BigIntDecorator('productId', false)
  productId?: bigint;
}
