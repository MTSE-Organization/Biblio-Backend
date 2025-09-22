import { CartItem } from '@/models';

export class CreateOrderFromCartForm {
  cartItems: CartItem[];
  addressId: bigint;
  couponIds: bigint[];
  accountId: bigint;
}
