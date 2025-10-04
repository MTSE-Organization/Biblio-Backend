import { Expose } from 'class-transformer';

export class CheckFavoriteProductDto {
  @Expose()
  isFavorite: boolean;
}
