import {
  BigIntDecorator,
  BooleanDecorator,
  DateDecorator,
  NumberDecorator,
  StringDecorator
} from '@/common/decorators';

export class UpdateProductForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('name', true)
  name: string;

  @StringDecorator('description', true)
  description: string;

  @NumberDecorator('price', true)
  price: number;

  @DateDecorator('releaseDate', true)
  releaseDate: Date;

  @NumberDecorator('length')
  length: number | null = null;

  @NumberDecorator('length')
  width: number | null = null;

  @NumberDecorator('length')
  height: number | null = null;

  @NumberDecorator('ageRating')
  ageRating: number | null = null;

  @BooleanDecorator('isFeatured', true)
  isFeatured: boolean;

  @NumberDecorator('quantity', true)
  quantity: number;

  @NumberDecorator('discount')
  discount: number | null = null;

  @BigIntDecorator('categoryId', true)
  categoryId: bigint;
}
