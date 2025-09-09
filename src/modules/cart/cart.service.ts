import { Cart } from '@/models/cart.model';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AccountService } from '../account/account.service';
import { where } from 'sequelize';
import { CartItem } from '@/models/cart-item.model';
import { Product } from '@/models/product.model';
import { AddItemForm } from './forms';
import { NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { CartItemService } from '../cart-item/cart-item.service';
import { Category, ProductImage } from '@/models';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart)
    private readonly cartRepository: typeof Cart,

    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,

    private readonly cartItemService: CartItemService,
  ) {}

  async get(accountId: bigint) {
    await this.accountService.findById(accountId);
    let cart = await this.findByAccountId(accountId);
    if (cart === null) {
      cart = await this.cartRepository.create({ accountId });
    }
    return cart;
  }

  async addItem(form: AddItemForm) {
    await this.findById(form.cartId);
    await this.cartItemService.create(form);
    return { message: 'Add item successfully' };
  }

  async findById(id: bigint): Promise<Cart> {
    const cart = await this.cartRepository.findByPk(id, {
      include: [{ model: CartItem, include: [{ model: Product }] }],
    });
    if (cart == null) {
      throw new NotFoundException(
        'Cart not found',
        ErrorCode.CART_ERROR_NOT_FOUND,
      );
    }
    return cart;
  }

  async findByAccountId(accountId: bigint) {
    return await this.cartRepository.findOne({
      where: { accountId: accountId },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
              include: [{ model: Category }, { model: ProductImage }],
            },
          ],
        },
      ],
    });
  }

  async create(accountId: bigint) {
    if (!(await this.existsBy('accountId', accountId))) {
      await this.cartRepository.create({ accountId });
    }
  }

  async existsBy(field: keyof Cart, value: any): Promise<boolean> {
    const count = await this.cartRepository.count({
      where: { [field]: value },
    });
    return count > 0;
  }
}
