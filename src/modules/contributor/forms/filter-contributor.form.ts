import { PaginationForm } from '@/common/forms';
import {
  StringDecorator,
  NumberDecorator,
  BigIntDecorator
} from '@/common/decorators';
import { Op } from 'sequelize';
import { StringUtil } from '@/utils';
import { Type } from 'class-transformer';

export class FilterContributorForm extends PaginationForm {
  @BigIntDecorator('id')
  id: bigint;

  @StringDecorator('name')
  name?: string;

  @NumberDecorator('kind')
  kind?: number;

  @Type(() => Number)
  @NumberDecorator('status')
  status?: number;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (!StringUtil.isEmpty(this.name))
      where.name = { [Op.like]: `%${this.name}%` };
    if (this.kind !== undefined) where.kind = this.kind;
    if (this.status) where.status = this.status;
    if (this.id) where.id = this.id;

    return where;
  }
}
