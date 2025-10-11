import { PaginationForm } from '@/common/forms';
import { BigIntDecorator } from '@/common/decorators';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class FilterReviewForm extends PaginationForm {
  @BigIntDecorator('productId', false)
  productId?: bigint;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fromDate?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  toDate?: Date;
}
