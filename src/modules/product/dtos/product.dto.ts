import { CategoryAutoCompleteDto } from '@/modules/category/dtos';
import { ProductImageDto } from '@/modules/product-image/dtos';
import { Expose, Type } from 'class-transformer';

export class ProductDto {
  @Expose()
  id: bigint;

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
  ageRating?: number;

  @Expose()
  language?: string;

  @Expose()
  isFeatured: boolean;

  @Expose()
  metaData?: string;

  @Expose()
  discount: number;

  @Expose()
  @Type(() => CategoryAutoCompleteDto)
  category: CategoryAutoCompleteDto;

  @Expose()
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
