import { NumberDecorator, StringDecorator } from '@/common/decorators';
import { PaginationForm } from '@/common/forms';
import { Type } from 'class-transformer';

export class SearchProductForm extends PaginationForm {
  @StringDecorator('keyword')
  keyword: string;

  @Type(() => Number)
  @NumberDecorator('minPrice')
  minPrice: number;

  @Type(() => Number)
  @NumberDecorator('maxPrice')
  maxPrice: number;

  @Type(() => Number)
  @NumberDecorator('ageRating')
  ageRating: number;

  @Type(() => Number)
  @NumberDecorator('rating')
  rating: number;

  @StringDecorator('language')
  language: string;

  @StringDecorator('categoryId')
  categoryId: string;

  @StringDecorator('sortBy')
  sortBy?: 'price' | 'createdDate';

  @StringDecorator('asc')
  sortOrder?: 'asc' | 'desc';
}
