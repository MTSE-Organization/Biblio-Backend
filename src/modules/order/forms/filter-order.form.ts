import { BigIntDecorator, NumberDecorator } from '@/common/decorators';
import { PaginationForm } from '@/common/forms';
import { Type } from 'class-transformer';

export class FilterOrderForm extends PaginationForm {
  @Type(() => Number)
  @NumberDecorator('currentStatus')
  currentStatus: number;

  @Type(() => BigInt)
  @BigIntDecorator('accountId')
  accountId: bigint;

  @Type(() => Number)
  @NumberDecorator('paymentMethod')
  paymentMethod: number;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (this.currentStatus !== undefined)
      where.currentStatus = this.currentStatus;
    if (this.accountId !== undefined) where.accountId = this.accountId;
    if (this.paymentMethod !== undefined)
      where.paymentMethod = this.paymentMethod;
    return where;
  }
}
