import { ProductAutoCompleteDto, ProductDto } from '@/modules/product/dtos';
import { Expose, Type } from 'class-transformer';

export class ViewedProductDto {
  @Expose()
  id: bigint;

  @Expose()
  @Type(() => ProductAutoCompleteDto)
  product: ProductAutoCompleteDto;

  @Expose()
  viewedAt: Date;

  @Expose()
  viewCount: number;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
