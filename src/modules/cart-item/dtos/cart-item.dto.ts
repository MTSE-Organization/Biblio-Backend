import { ProductVariantDto } from '@/modules/product-variant/dtos';
import { Expose, Type } from 'class-transformer';

export class CartItemDto {
  @Expose()
  id: bigint;

  @Expose()
  cartId: bigint;

  @Expose()
  @Type(() => ProductVariantDto)
  productVariant: ProductVariantDto;

  @Expose()
  quantity: number;
}
