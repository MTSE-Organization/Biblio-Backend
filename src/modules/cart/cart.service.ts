import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccountService } from '../account/account.service';
import { AddItemForm, CheckoutForm } from './forms';
import { CartItemService } from '../cart-item/cart-item.service';
import { Cart, CartItem, Category, Product, ProductVariant } from '@/models';
import { OrderService } from '../order/order.service';
import { BadRequestException } from '@/common/exceptions';
import { ErrorCode } from '@/constants';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart)
    private readonly cartRepository: typeof Cart,

    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly cartItemService: CartItemService,
    private readonly orderService: OrderService
  ) {}

  async get(accountId: bigint) {
    await this.accountService.findById(accountId);
    let cart = await this.findByAccountId(accountId);
    if (cart === null) {
      cart = await this.cartRepository.create({ accountId });
    }
    return cart;
  }

  async addItem(form: AddItemForm, accountId: bigint) {
    let cart = await this.cartRepository.findOne({
      where: { accountId: accountId }
    });
    if (cart === null) {
      cart = await this.cartRepository.create({ accountId });
    }
    await this.cartItemService.create(cart.id, form);
    return { message: 'Add item successfully' };
  }

  async findByAccountId(accountId: bigint) {
    return await this.cartRepository.findOne({
      where: { accountId: accountId },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: ProductVariant,
              include: [
                {
                  model: Product,
                  include: [{ model: Category }]
                }
              ]
            }
          ]
        }
      ]
    });
  }

  async create(accountId: bigint) {
    if (!(await this.existsBy('accountId', accountId))) {
      await this.cartRepository.create({ accountId });
    }
  }

  async checkout(form: CheckoutForm, accountId: bigint) {
    await this.accountService.findById(accountId);
    const cartItems = await this.cartItemService.findByIdsAndAccount(
      form.cartItemIds,
      accountId
    );
    for (const item of cartItems) {
      if (item.productVariant.quantity < item.quantity) {
        throw new BadRequestException(
          'The product is out of stock',
          ErrorCode.PRODUCT_VARIANT_ERROR_OUT_OF_STOCK
        );
      }
    }
    return await this.orderService.createFromCart({
      cartItems,
      addressId: form.addressId,
      couponId: form.couponIds,
      accountId
    });
  }

  async existsBy(field: keyof Cart, value: any): Promise<boolean> {
    const count = await this.cartRepository.count({
      where: { [field]: value }
    });
    return count > 0;
  }
}
