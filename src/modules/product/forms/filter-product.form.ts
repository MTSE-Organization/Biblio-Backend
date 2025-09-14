import {
  BigIntDecorator,
  BooleanDecorator,
  NumberDecorator,
  StringDecorator
} from '@/common/decorators';
import { PaginationForm } from '@/common/forms';
import { StringUtil } from '@/utils';
import { Type } from 'class-transformer';
import { Op } from 'sequelize';

export class FilterProductForm extends PaginationForm {
  @StringDecorator('name')
  name: string;

  @Type(() => Number)
  @NumberDecorator('ageRating')
  ageRating: number;

  @StringDecorator('language')
  language: string;

  @BooleanDecorator('isFeatured')
  isFeatured: boolean;

  @Type(() => BigInt)
  @BigIntDecorator('categoryId')
  categoryId: bigint;

  @Type(() => BigInt)
  @BigIntDecorator('publisherId')
  publisherId: bigint;

  @NumberDecorator('status')
  status?: number;

  getFilter(): Record<string, any> {
    const where: Record<string, any> = {};
    if (!StringUtil.isEmpty(this.name))
      where.name = { [Op.like]: `%${this.name}%` };
    if (this.ageRating !== undefined) where.ageRating = this.ageRating;
    if (!StringUtil.isEmpty(this.language)) where.language = this.language;
    if (this.isFeatured !== undefined) where.isFeatured = this.isFeatured;
    if (this.categoryId !== undefined) where.categoryId = this.categoryId;
    if (this.publisherId !== undefined) where.publisherId = this.publisherId;
    if (this.status) where.status = this.status;

    return where;
  }
}
