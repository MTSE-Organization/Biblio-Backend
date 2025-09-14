import {
  BigIntDecorator,
  NumberDecorator,
  StringDecorator
} from '@/common/decorators';
import { PaginationForm } from '@/common/forms';
import { Type } from 'class-transformer';

export class FilterProductVariantForm extends PaginationForm {
  @Type(() => Number)
  @NumberDecorator('condition')
  condition: string;

  @Type(() => Number)
  @NumberDecorator('format')
  format: number;

  @Type(() => BigInt)
  @BigIntDecorator('productId')
  productId: bigint;

  @NumberDecorator('status')
  status?: number;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (this.condition !== undefined) where.condition = this.condition;
    if (this.format !== undefined) where.format = this.format;
    if (this.productId !== undefined) where.productId = this.productId;
    if (this.status) where.status = this.status;

    return where;
  }
}
