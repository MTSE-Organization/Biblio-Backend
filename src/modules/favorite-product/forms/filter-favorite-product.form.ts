import { BigIntDecorator } from '@/common/decorators';
import { PaginationForm } from '@/common/forms';
import { Expose, Type } from 'class-transformer';

export class FilterFavoriteProductForm extends PaginationForm {
  @BigIntDecorator('productId')
  productId: string;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (this.productId) where.productId = this.productId;

    return where;
  }
}
