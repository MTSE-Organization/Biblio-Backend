import { BigIntDecorator } from '@/common/decorators';
import { PaginationForm } from '@/common/forms';

export class FilterProductImageForm extends PaginationForm {
  @BigIntDecorator('productId', true)
  productId: bigint;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (this.productId) where.productId = this.productId;

    return where;
  }
}
