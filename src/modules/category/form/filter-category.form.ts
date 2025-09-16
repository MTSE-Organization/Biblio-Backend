import { NumberDecorator, StringDecorator } from '@/common/decorators';
import { PaginationForm } from '@/common/forms';
import { StringUtil } from '@/utils';
import { Type } from 'class-transformer';
import { Op } from 'sequelize';

export class FilterCategoryForm extends PaginationForm {
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

    return where;
  }
}
