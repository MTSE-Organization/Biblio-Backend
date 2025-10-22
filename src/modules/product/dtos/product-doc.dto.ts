import { CategoryDocDto } from '@/modules/category/dtos';
import { ProductImageAutoCompleteDto } from '@/modules/product-image/dtos';
import { Expose, Type } from 'class-transformer';

export class ProductDocDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  price: number;

  @Expose()
  createdDate: Date;

  @Expose()
  ageRating: number;

  @Expose()
  language: string;

  @Expose()
  discount: number;

  @Expose()
  totalViews: number;

  @Expose()
  totalReviews: number;

  @Expose()
  averageReview: number;

  @Expose()
  totalSold: number;

  @Expose()
  @Type(() => ProductImageAutoCompleteDto)
  image: ProductImageAutoCompleteDto;

  @Expose()
  @Type(() => CategoryDocDto)
  category: CategoryDocDto;
}
