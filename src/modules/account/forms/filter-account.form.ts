import {
  BooleanDecorator,
  NumberDecorator,
  StringDecorator,
} from '@/common/decorators';
import { PaginationForm } from '@/common/forms';
import { Type } from 'class-transformer';
import { Op } from 'sequelize';

export class FilterAccountForm extends PaginationForm {
  @StringDecorator('email')
  email: string;

  @StringDecorator('fullName')
  fullName: string;

  @StringDecorator('phone')
  phone: string;

  @Type(() => Number)
  @NumberDecorator('kind')
  kind: number;

  @Type(() => Boolean)
  @BooleanDecorator('isSuperAdmin')
  isSuperAdmin: boolean;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (this.email) where.email = { [Op.like]: `%${this.email}%` };
    if (this.fullName) where.fullName = { [Op.like]: `%${this.fullName}%` };
    if (this.phone) where.phone = { [Op.like]: `%${this.phone}%` };
    if (this.kind !== undefined) where.kind = this.kind;
    if (this.isSuperAdmin !== undefined) where.isSuperAdmin = this.isSuperAdmin;

    return where;
  }
}
