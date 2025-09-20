import { CartItem } from '@/models';

export class CreateOrderFromCartForm {
  cartItems: CartItem[];
  addressId: bigint;
  couponId: bigint[];
  accountId: bigint;
}
