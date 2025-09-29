import { NumberDecorator, StringDecorator } from '@/common/decorators';
import { PaginationForm } from '@/common/forms';
import { Type } from 'class-transformer';

export class SearchProductForm extends PaginationForm {
  @StringDecorator('keyword')
  keyword: string;

  @NumberDecorator('minPrice')
  minPrice: number;

  @NumberDecorator('maxPrice')
  maxPrice: number;

  @Type(() => Number)
  @NumberDecorator('ageRating')
  ageRating: number;

  @StringDecorator('language')
  language: string;

  @StringDecorator('categoryId')
  categoryId: string;

  @StringDecorator('sortBy')
  sortBy?: 'price' | 'createdDate';

  @StringDecorator('asc')
  sortOrder?: 'asc' | 'desc';
}
