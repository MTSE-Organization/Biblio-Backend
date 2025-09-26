import { ProductDto } from '@/modules/product/dtos';
import { Expose, Type } from 'class-transformer';

export class ViewedProductDto {
  @Expose()
  id: bigint;

  @Expose()
  @Type(() => ProductDto)
  product: ProductDto;

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
