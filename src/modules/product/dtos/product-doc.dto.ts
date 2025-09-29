import { CategoryDocDto } from '@/modules/category/dtos';
import { Expose, Type } from 'class-transformer';

export class ProductDocDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

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
  imageUrl: string;

  @Expose()
  @Type(() => CategoryDocDto)
  category: CategoryDocDto;
}
