import { PaginationForm } from '@/common/forms';
import { BigIntDecorator } from '@/common/decorators';
import { Type } from 'class-transformer';

export class FilterAddressForm extends PaginationForm {
  @Type(() => BigInt)
  @BigIntDecorator('accountId', true)
  accountId: bigint;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (this.accountId) where.accountId = this.accountId;
    return where;
  }
}
