import { CartItem, OrderItem, Product, ProductVariant } from '@/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductVariantService } from '../product-variant/product-variant.service';
import bigDecimal from 'js-big-decimal';
import { BadRequestException } from '@/common/exceptions';
import { ErrorCode } from '@/constants';
import { Transaction } from 'sequelize';
import { CartItemService } from '../cart-item/cart-item.service';
import { ProductMetaData } from '../product/types';

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
    const price = bigDecimal.add(
      productVariant.product.price,
      productVariant.modifiedPrice
    );
    const discount = productVariant.product.discount;
    const total = bigDecimal.multiply(
      price,
      bigDecimal.divide(bigDecimal.subtract(100, discount), 100)
    );
    const item = {
      orderId: orderId,
      productVariantId: productVariantId,
      quantity: quantity,
      price: price,
      discount: discount,
      total: bigDecimal.multiply(total, quantity)
    };
    await this.orderItemRepository.create(item, { transaction });
  }

  async createMany(
    cartItems: CartItem[],
    orderId: bigint,
    transaction: Transaction
  ) {
    const items = cartItems.map((cartItem) => {
      const itemPrice = bigDecimal.add(
        cartItem.productVariant.product.price,
        cartItem.productVariant.modifiedPrice
      );
      const discount = cartItem.productVariant.product.discount;
      const finalPrice = bigDecimal.multiply(
        itemPrice,
        bigDecimal.divide(bigDecimal.subtract(100, discount), 100)
      );
      return {
        orderId: orderId,
        productVariantId: cartItem.productVariantId,
        quantity: cartItem.quantity,
        price: itemPrice,
        discount: discount,
        total: bigDecimal.multiply(finalPrice, cartItem.quantity),
        cartItemId: cartItem.id
      };
    });
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

  async processCancelOrderItems(orderId: bigint, transaction?: Transaction) {
    const orderItems = await this.orderItemRepository.findAll({
      where: { orderId },
      include: [{ model: ProductVariant }]
    });

    for (const orderItem of orderItems) {
      const productVariant = orderItem.productVariant;

      if (!productVariant) {
        throw new BadRequestException(
          `ProductVariant not found for orderItem ${orderItem.id}`
        );
      }
      productVariant.quantity += orderItem.quantity;
      await productVariant.save({ transaction });
    }
  }

  async calculateTotalWeight(orderId: bigint): Promise<number> {
    const orderItems = await this.orderItemRepository.findAll({
      where: { orderId },
      include: [{ model: ProductVariant, include: [{ model: Product }] }]
    });
    let totalWeight = 0;
    for (const orderItem of orderItems) {
      let metaData: ProductMetaData;

      if (typeof orderItem.productVariant.product.metaData === 'string') {
        metaData = JSON.parse(
          orderItem.productVariant.product.metaData
        ) as ProductMetaData;
      } else {
        metaData = orderItem.productVariant.product.metaData as ProductMetaData;
      }

      if (metaData?.weight) {
        totalWeight += metaData.weight;
      }
    }
    return totalWeight;
  }

  async findByOrderId(orderId: bigint, transaction?: Transaction) {
    return await this.orderItemRepository.findAll({
      where: { orderId: BigInt(orderId) },
      transaction
    });
  }
}
