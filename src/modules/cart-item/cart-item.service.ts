import { CartItem } from '@/models/cart-item.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddItemForm } from '../cart/forms';
import { ProductService } from '../product/product.service';
import { UpdateCartItemForm } from './forms';
import { ErrorCode } from '@/constants/error-code.constant';

@Injectable()
export class CartItemService {
  constructor(
    @InjectModel(CartItem)
    private readonly cartItemRepository: typeof CartItem,

    private readonly productService: ProductService
  ) {}

  async create(form: AddItemForm) {
    await this.productService.findById(form.productId);
    const cartItem = await this.findByCartAndProduct(
      form.cartId,
      form.productId
    );
    if (cartItem == null) {
      await this.cartItemRepository.create({ ...form });
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

  async findByCartAndProduct(cartId: bigint, productId: bigint) {
    return await this.cartItemRepository.findOne({
      where: { cartId: cartId, productId: productId }
    });
  }
}
