import { CategoryAutoCompleteDto } from '@/modules/category/dtos';
import { Expose, Type } from 'class-transformer';

export class ProductDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  releaseDate: Date;

  @Expose()
  length: number;

  @Expose()
  width: number;

  @Expose()
  height: number;

  @Expose()
  ageRating: number;

  @Expose()
  isFeatured: boolean;

  @Expose()
  quantity: number;

  @Expose()
  @Type(() => CategoryAutoCompleteDto)
  category: CategoryAutoCompleteDto;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
