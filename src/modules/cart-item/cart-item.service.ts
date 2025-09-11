import { CartItem } from '@/models/cart-item.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddItemForm } from '../cart/forms';
import { UpdateCartItemForm } from './forms';
import { ErrorCode } from '@/constants/error-code.constant';
import { ProductVariantService } from '../product-variant/product-variant.service';

@Injectable()
export class CartItemService {
  constructor(
    @InjectModel(CartItem)
    private readonly cartItemRepository: typeof CartItem,

    private readonly productVariantService: ProductVariantService
  ) {}

  async create(cartId: bigint, form: AddItemForm) {
    await this.productVariantService.findById(form.productVariantId);
    const cartItem = await this.findByCartAndProduct(
      cartId,
      form.productVariantId
    );
    if (cartItem == null) {
      await this.cartItemRepository.create({ cartId, ...form });
    } else {
      await cartItem.update({ quantity: cartItem.quantity + form.quantity });
    }
  }

  async update(form: UpdateCartItemForm) {
    const cartItem = await this.findById(form.id);
    await cartItem.update({ quantity: form.quantity });
    return { message: 'Update cart item successfully' };
  }

  async delete(id: bigint) {
    const cartItem = await this.findById(id);
    await cartItem.destroy();
    return { message: 'Delete cart item successfully' };
  }

  async findById(id: bigint): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findByPk(id);
    if (cartItem == null) {
      throw new NotFoundException(
        'Cart Item not found',
        ErrorCode.CART_ITEM_ERROR_NOT_FOUND
      );
    }
    return cartItem;
  }

  async findByCartAndProduct(cartId: bigint, variantId: bigint) {
    return await this.cartItemRepository.findOne({
      where: { cartId: cartId, productVariantId: variantId }
    });
  }
}
