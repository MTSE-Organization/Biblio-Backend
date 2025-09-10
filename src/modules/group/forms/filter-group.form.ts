import {
  BooleanDecorator,
  NumberDecorator,
  StringDecorator
} from '@/common/decorators';
import { PaginationForm } from '@/common/forms';
import { Type } from 'class-transformer';
import { Op } from 'sequelize';

export class FilterGroupForm extends PaginationForm {
  @StringDecorator('name')
  name: string;

  @Type(() => Number)
  @NumberDecorator('kind')
  kind: number;

  @BooleanDecorator('isSystemRole')
  isSystemRole: boolean;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (this.name) where.name = { [Op.like]: `%${this.name}%` };
    if (this.kind !== undefined) where.kind = this.kind;
    if (this.isSystemRole !== undefined) where.isSystemRole = this.isSystemRole;

    return where;
  }
}
