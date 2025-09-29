import { PaginationForm } from '@/common/forms';
import {
  BigIntDecorator,
  NumberDecorator,
  StringDecorator
} from '@/common/decorators';
import { Op } from 'sequelize';
import { StringUtil } from '@/utils';
import { Type } from 'class-transformer';

export class FilterPublisherForm extends PaginationForm {
  @BigIntDecorator('id')
  id: bigint;

  @StringDecorator('name')
  name?: string;

  @Type(() => Number)
  @NumberDecorator('status')
  status?: number;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (!StringUtil.isEmpty(this.name))
      where.name = { [Op.like]: `%${this.name}%` };
    if (this.status) where.status = this.status;
    if (this.id) where.id = this.id;

    return where;
  }
}
