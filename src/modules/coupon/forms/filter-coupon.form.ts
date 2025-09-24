import {
  BigIntDecorator,
  NumberDecorator,
  StringDecorator
} from '@/common/decorators';
import { PaginationForm } from '@/common/forms';
import { Type } from 'class-transformer';
import { Op } from 'sequelize';

export class FilterCouponForm extends PaginationForm {
  @BigIntDecorator('id')
  id: bigint;

  @StringDecorator('code')
  code?: string;

  @StringDecorator('name')
  name?: string;

  @Type(() => Number)
  @NumberDecorator('kind')
  kind: number;

  @Type(() => Number)
  @NumberDecorator('type')
  type: number;

  @Type(() => Number)
  @NumberDecorator('status')
  status: number;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (this.code) where.code = { [Op.like]: `%${this.code}%` };
    if (this.name) where.name = { [Op.like]: `%${this.name}%` };
    if (this.kind) where.kind = this.kind;
    if (this.type) where.type = this.type;
    if (this.status) where.status = this.status;
    if (this.id) where.id = this.id;

    return where;
  }
}
