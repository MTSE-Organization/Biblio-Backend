import {
  BigIntDecorator,
  BooleanDecorator,
  DateDecorator,
  NumberDecorator,
  StringDecorator
} from '@/common/decorators';
import { Min } from 'class-validator';

export class CreateProductForm {
  @StringDecorator('name', true)
  name: string;

  @StringDecorator('description', true)
  description: string;

  @NumberDecorator('price', true)
  @Min(0)
  price: number;

  @DateDecorator('releaseDate', true)
  releaseDate: Date;

  @NumberDecorator('ageRating')
  ageRating: number;

  @StringDecorator('string')
  language: string;

  @BooleanDecorator('isFeatured', true)
  isFeatured: boolean;

  @StringDecorator('metaData')
  metaData: string;

  @NumberDecorator('discount')
  @Min(0)
  discount: number;

  @BigIntDecorator('categoryId', true)
  categoryId: bigint;

  @BigIntDecorator('publisherId', true)
  publisherId: bigint;
}
