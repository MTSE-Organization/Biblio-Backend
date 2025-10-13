import {
  BooleanDecorator,
  NumberDecorator,
  StringDecorator
} from '@/common/decorators';
import { PaginationForm } from '@/common/forms';
import { Type } from 'class-transformer';

export class FilterNotificationForm extends PaginationForm {
  @StringDecorator('type')
  type: number;

  @Type(() => BigInt)
  @NumberDecorator('accountId')
  accountId: bigint;

  @BooleanDecorator('seen')
  seen: boolean;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (this.type !== undefined) where.type = this.type;
    if (this.accountId !== undefined) where.accountId = this.accountId;
    if (this.seen !== undefined) where.seen = this.seen;

    return where;
  }
}
