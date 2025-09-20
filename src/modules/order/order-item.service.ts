import { CartItem, OrderItem, ProductVariant } from '@/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductVariantService } from '../product-variant/product-variant.service';
import bigDecimal from 'js-big-decimal';
import { BadRequestException } from '@/common/exceptions';
import { ErrorCode } from '@/constants';
import { Transaction } from 'sequelize';
import { CartItemService } from '../cart-item/cart-item.service';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectModel(OrderItem)
    private readonly orderItemRepository: typeof OrderItem,

    private readonly productVariantService: ProductVariantService,

    private readonly cartItemService: CartItemService
  ) {}

  async createOne(
    productVariantId: bigint,
    quantity: number,
    orderId: bigint,
    transaction: Transaction
  ) {
    const productVariant =
      await this.productVariantService.findById(productVariantId);
    if (productVariant.quantity < quantity) {
      throw new BadRequestException(
        'The product is out of stock',
        ErrorCode.PRODUCT_VARIANT_ERROR_OUT_OF_STOCK
      );
    }
    const item = {
      orderId: orderId,
      productVariantId: productVariantId,
      quantity: quantity,
      price: bigDecimal.add(
        productVariant.product.price,
        productVariant.modifiedPrice
      ),
      discount: productVariant.product.discount
    };
    await this.orderItemRepository.create(item, { transaction });
  }

  async createMany(
    cartItems: CartItem[],
    orderId: bigint,
    transaction: Transaction
  ) {
    const items = cartItems.map((cartItem) => ({
      orderId: orderId,
      productVariantId: cartItem.productVariantId,
      quantity: cartItem.quantity,
      price: bigDecimal.add(
        cartItem.productVariant.product.price,
        cartItem.productVariant.modifiedPrice
      ),
      discount: cartItem.productVariant.product.discount,
      cartItemId: cartItem.id
    }));
    await this.orderItemRepository.bulkCreate(items, {
      individualHooks: true,
      transaction
    });
  }

  async processOrderItems(orderId: bigint, transaction?: Transaction) {
    const orderItems = await this.orderItemRepository.findAll({
      where: { orderId },
      include: [{ model: ProductVariant }]
    });
    const cartItemIds: bigint[] = [];

    for (const orderItem of orderItems) {
      const productVariant = orderItem.productVariant;

      if (!productVariant) {
        throw new BadRequestException(
          `ProductVariant not found for orderItem ${orderItem.id}`
        );
      }

      if (productVariant.quantity < orderItem.quantity) {
        throw new BadRequestException(
          `Product ${productVariant.id} is out of stock`,
          ErrorCode.PRODUCT_VARIANT_ERROR_OUT_OF_STOCK
        );
      }

      productVariant.quantity -= orderItem.quantity;
      await productVariant.save({ transaction });

      if (orderItem.cartItemId) {
        cartItemIds.push(orderItem.cartItemId);
      }
    }

    if (cartItemIds.length > 0) {
      await this.cartItemService.deleteMany(cartItemIds, transaction);
    }
  }
}
