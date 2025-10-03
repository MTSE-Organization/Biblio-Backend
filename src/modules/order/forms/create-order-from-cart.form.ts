import { CartItem } from '@/models';

export class CreateOrderFromCartForm {
  cartItems: CartItem[];
  couponIds: bigint[];
  accountId: bigint;
}
