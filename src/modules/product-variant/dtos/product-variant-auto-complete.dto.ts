import { ProductAutoCompleteDto } from '@/modules/product/dtos';
import { Expose, Type } from 'class-transformer';

export class ProductVariantAutoCompleteDto {
  @Expose()
  id: bigint;

  @Expose()
  condition: number;

  @Expose()
  format: number;

  @Expose()
  quantity: number;

  @Expose()
  modifiedPrice: string;

  @Expose()
  imageUrl: string;

  @Expose()
  @Type(() => ProductAutoCompleteDto)
  product: ProductAutoCompleteDto;

  @Expose()
  status: number;
}
