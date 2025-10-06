import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import {
  BigIntDecorator,
  NumberDecorator,
  StringDecorator
} from '@/common/decorators';
import { Type } from 'class-transformer';

export class ReviewForm {
  @BigIntDecorator('productId', true)
  productId: bigint;

  @Type(() => Number)
  @NumberDecorator('rate')
  rate: number;

  @StringDecorator('content')
  content: string;
}
