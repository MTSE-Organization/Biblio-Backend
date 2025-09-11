import { ProductAutoCompleteDto } from '@/modules/product/dtos';
import { Expose, Type } from 'class-transformer';

export class ProductVariantDto {
  @Expose()
  id: bigint;

  @Expose()
  condition: number;

  @Expose()
  format: number;

  @Expose()
  quantity: number;

  @Expose()
  modifiedPrice: number;

  @Expose()
  imageUrl: string;

  @Expose()
  @Type(() => ProductAutoCompleteDto)
  product: ProductAutoCompleteDto;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
