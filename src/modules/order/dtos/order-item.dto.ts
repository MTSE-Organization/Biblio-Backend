import { ProductVariantAutoCompleteDto } from '@/modules/product-variant/dtos';
import { Expose, Type } from 'class-transformer';

export class OrderItemDto {
  @Expose()
  id: number;

  @Expose()
  orderId: bigint;

  @Expose()
  @Type(() => ProductVariantAutoCompleteDto)
  productVariant: ProductVariantAutoCompleteDto;

  @Expose()
  quantity: number;

  @Expose()
  price: string;

  @Expose()
  discount: number;

  @Expose()
  total: string;
}
