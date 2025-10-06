import { CategoryAutoCompleteDto } from '@/modules/category/dtos';
import { ProductImageAutoCompleteDto } from '@/modules/product-image/dtos';
import { Expose, Type } from 'class-transformer';

export class ProductAutoCompleteDto {
  @Expose()
  id: bigint;

  @Expose()
  name: string;

  @Expose()
  @Type(() => ProductImageAutoCompleteDto)
  image?: ProductImageAutoCompleteDto;

  @Expose()
  @Type(() => CategoryAutoCompleteDto)
  category?: CategoryAutoCompleteDto;

  @Expose()
  price: string;

  @Expose()
  slug: string;

  @Expose()
  quantity: number;

  @Expose()
  discount: number;

  @Expose()
  totalViews: number;

  @Expose()
  status: number;

  @Expose()
  totalReviews: number;

  @Expose()
  averageReview: number;
}
