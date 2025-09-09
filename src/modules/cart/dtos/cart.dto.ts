import { CartItemDto } from '@/modules/cart-item/dtos';
import { Expose, Type } from 'class-transformer';

export class CartDto {
  @Expose()
  id: bigint;

  @Expose()
  accountId: bigint;

  @Expose()
  @Type(() => CartItemDto)
  cartItems: CartItemDto[];

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
