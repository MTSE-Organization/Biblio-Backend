import { PaginationForm } from '@/common/forms';
import { StringDecorator } from '@/common/decorators';
import { Op } from 'sequelize';

export class FilterPublisherForm extends PaginationForm {
  @StringDecorator('name')
  name?: string;

  @StringDecorator('status')
  status?: number;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (this.name) where.name = { [Op.like]: `%${this.name}%` };
    if (this.status) where.status = this.status;

    return where;
  }
}
