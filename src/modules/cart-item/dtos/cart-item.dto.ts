import { ProductDto } from '@/modules/product/dtos';
import { Expose, Type } from 'class-transformer';

export class CartItemDto {
  @Expose()
  id: bigint;

  @Expose()
  cartId: bigint;

  @Expose()
  @Type(() => ProductDto)
  product: ProductDto;

  @Expose()
  quantity: number;
}
