import { NumberDecorator, StringDecorator } from '@/common/decorators';
import { PaginationForm } from '@/common/forms'; // Lớp phân trang
import { Op } from 'sequelize';

export class FilterCouponForm extends PaginationForm {
  @StringDecorator('code')
  code?: string;

  @StringDecorator('name')
  name?: string;

  @NumberDecorator('kind')
  kind?: number;

  @NumberDecorator('type')
  type?: number;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (this.code) where.code = { [Op.like]: `%${this.code}%` };
    if (this.name) where.name = { [Op.like]: `%${this.name}%` };
    if (this.kind) where.kind = this.kind;
    if (this.type) where.type = this.type;
    return where;
  }
}
