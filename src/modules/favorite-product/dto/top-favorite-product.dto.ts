import { CategoryAutoCompleteDto } from '@/modules/category/dtos';
import { Expose } from 'class-transformer';

export class TopFavoriteProductDto {
  @Expose()
  productId: string;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  price: number;

  @Expose()
  image: string;

  @Expose()
  discount: number;

  @Expose()
  category: CategoryAutoCompleteDto;

  @Expose()
  averageRating: number;

  @Expose()
  totalReviews: number;

  @Expose()
  totalFavorites: number;
}
