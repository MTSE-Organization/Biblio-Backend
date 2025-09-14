import { PaginationForm } from '@/common/forms';
import { StringDecorator, NumberDecorator } from '@/common/decorators';
import { Op } from 'sequelize';

export class FilterContributorForm extends PaginationForm {
  @StringDecorator('name')
  name?: string;

  @NumberDecorator('kind')
  kind?: number;

  @StringDecorator('status')
  status?: number;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (this.name) where.name = { [Op.like]: `%${this.name}%` };
    if (this.kind !== undefined) where.kind = this.kind;
    if (this.status) where.status = this.status;

    return where;
  }
}
