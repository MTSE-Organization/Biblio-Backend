import {
  BigIntArrayDecorator,
  BigIntDecorator,
  BooleanDecorator,
  DateDecorator,
  IntDecorator,
  NumberDecorator,
  StringDecorator
} from '@/common/decorators';
import { Max, Min } from 'class-validator';

export class UpdateProductForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('name', true)
  name: string;

  @StringDecorator('description', true)
  description: string;

  @NumberDecorator('price', true)
  @Min(0)
  price: number;

  @DateDecorator('releaseDate', true)
  releaseDate: Date;

  @IntDecorator('ageRating')
  ageRating: number;

  @StringDecorator('string')
  language: string;

  @BooleanDecorator('isFeatured', true)
  isFeatured: boolean;

  @StringDecorator('metaData')
  metaData: string;

  @IntDecorator('discount')
  @Min(0)
  @Max(100)
  discount: number;

  @BigIntDecorator('categoryId', true)
  categoryId: bigint;

  @BigIntDecorator('publisherId', true)
  publisherId: bigint;

  @BigIntArrayDecorator('contributorsIds', true)
  contributorIds: [bigint];
}
