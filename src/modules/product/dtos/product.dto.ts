import { CategoryAutoCompleteDto } from '@/modules/category/dtos';
import { ProductImageDto } from '@/modules/product-image/dtos/product-image.dto';
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
  discount: number;

  @Expose()
  @Type(() => CategoryAutoCompleteDto)
  category: CategoryAutoCompleteDto;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;

  @Expose()
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];
}
