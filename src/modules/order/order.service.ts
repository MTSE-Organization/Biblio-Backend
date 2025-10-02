import {
  Address,
  Coupon,
  Order,
  OrderItem,
  OrderStatus,
  ProductVariant
} from '@/models';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import {
  CreateOrderForm,
  CreateOrderFromCartForm,
  FilterOrderForm,
  PlaceOrderForm,
  UpdateStatusForm
} from './forms';
import { AccountService } from '../account/account.service';
import { AddressService } from '../address/address.service';
import { Constant, ErrorCode } from '@/constants';
import { OrderItemService } from './order-item.service';
import { OrderStatusService } from './order-status.service';
import { Sequelize, Transaction } from 'sequelize';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { CouponService } from '../coupon/coupon.service';
import bigDecimal from 'js-big-decimal';
import { CreateOrderDto } from './dtos';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private readonly orderRepository: typeof Order,
    private readonly orderItemService: OrderItemService,
    private readonly orderStatusService: OrderStatusService,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly addressService: AddressService,
    private readonly couponService: CouponService,
    @InjectConnection() private readonly sequelize: Sequelize
  ) {}

  async create(form: CreateOrderForm, accountId: bigint) {
    return await this.sequelize.transaction(async (t) => {
      await this.accountService.findById(accountId);
      const address =
        await this.addressService.findByAccountIdAndDefault(accountId);
      const order = await Order.create(
        {
          accountId,
          addressId: address.id,
          deliveryFee: '30000'
        },
        { transaction: t }
      );

      await this.orderItemService.createOne(
        form.productVariantId,
        form.quantity,
        order.id,
        t
      );

      await this.orderStatusService.create(
        Constant.ORDER_STATUS_WAITING,
        order.id,
        t
      );

      await order.update(
        { total: await this.calculateTotal(order, t) },
        { transaction: t }
      );
      const dto = new CreateOrderDto();
      dto.orderId = order.id;
      return { message: 'Create order successfully', data: dto };
    });
  }

  async createFromCart(form: CreateOrderFromCartForm) {
    return await this.sequelize.transaction(async (t) => {
      // get address
      let address: Address;
      if (form.addressId) {
        address = await this.addressService.findById(
          form.addressId,
          form.accountId
        );
      } else {
        // get address default
        address = await this.addressService.findByAccountIdAndDefault(
          form.accountId
        );
      }

      // check coupons
      const coupons = await this.couponService.findByIds(form.couponIds);
      if (!this.couponService.checkValid(coupons)) {
        throw new BadRequestException(
          'Coupon is not valid',
          ErrorCode.COUPON_ERROR_INVALID
        );
      }

      // creeate order
      const order = await this.orderRepository.create(
        {
          accountId: form.accountId,
          addressId: address.id,
          deliveryFee: '30000'
        },
        { transaction: t }
      );

      // create orderItems and orderStatus
      await Promise.all([
        order.$set('coupons', coupons, { transaction: t }),
        this.orderItemService.createMany(form.cartItems, order.id, t),
        this.orderStatusService.create(
          Constant.ORDER_STATUS_WAITING,
          order.id,
          t
        )
      ]);

      // update deliveryFee
      const weight = await this.orderItemService.calculateTotalWeight(order.id);
      order.deliveryFee = (
        await this.addressService.calculateShippingFee(address, weight)
      ).toString();

      await order.update(
        { total: await this.calculateTotal(order, t) },
        { transaction: t }
      );

      const dto = new CreateOrderDto();
      dto.orderId = order.id;
      return { message: 'Create order successfully', data: dto };
    });
  }

  async placeOrder(form: PlaceOrderForm, accountId: bigint) {
    return await this.sequelize.transaction(async (t) => {
      // check account
      await this.accountService.findById(accountId);
      // get order
      const order = await this.orderRepository.findOne({
        where: {
          id: form.id,
          accountId,
          currentStatus: Constant.ORDER_STATUS_WAITING
        }
      });
      if (!order) {
        throw new NotFoundException(
          'Order not found',
          ErrorCode.ORDER_ERROR_NOT_FOUND
        );
      }
      // update address
      if (order.addressId !== form.addressId) {
        const [address, weight] = await Promise.all([
          await this.addressService.findById(form.addressId, accountId),
          await this.orderItemService.calculateTotalWeight(order.id)
        ]);

        order.deliveryFee = (
          await this.addressService.calculateShippingFee(address, weight)
        ).toString();
        order.addressId = form.addressId;
      }
      //coupon
      const coupons = await this.couponService.findByIds(form.couponIds);
      if (!this.couponService.checkValid(coupons)) {
        throw new BadRequestException(
          'Coupon is not valid',
          ErrorCode.COUPON_ERROR_INVALID
        );
      }
      await Promise.all([
        order.$set('coupons', coupons, { transaction: t }),
        this.couponService.decreaseQuantity(coupons, t)
      ]);
      // update information
      order.paymentMethod = form.paymentMethod;
      order.currentStatus = Constant.ORDER_STATUS_WAITING_CONFIRMATION;
      // payment method cod
      if (form.paymentMethod === Constant.PAYMENT_METHOD_COD) {
        await this.orderStatusService.create(
          Constant.ORDER_STATUS_WAITING_CONFIRMATION,
          order.id,
          t
        );
      } else {
        // call to VNPAY API
        await this.orderStatusService.create(
          Constant.ORDER_STATUS_WAITING_CONFIRMATION,
          order.id,
          t
        );
      }
      await this.orderItemService.processOrderItems(order.id, t);
      order.total = await this.calculateTotal(order, t);
      await order.save({ transaction: t });
      return { message: 'Place order successfully' };
    });
  }

  async findByIdAndAccount(id: bigint, accountId: bigint) {
    const order = await this.orderRepository.findOne({
      where: { id, accountId },
      include: [
        {
          model: OrderItem,
          include: [{ model: ProductVariant }]
        },
        { model: OrderStatus },
        { model: Address },
        { model: Coupon }
      ]
    });
    if (!order) {
      throw new NotFoundException(
        'Order not found',
        ErrorCode.ORDER_ERROR_NOT_FOUND
      );
    }
    return order;
  }

  async findById(id: bigint) {
    const order = await this.orderRepository.findByPk(id, {
      include: [
        {
          model: OrderItem,
          include: [{ model: ProductVariant }]
        },
        { model: OrderStatus },
        { model: Address },
        { model: Coupon }
      ]
    });
    if (!order) {
      throw new NotFoundException(
        'Order not found',
        ErrorCode.ORDER_ERROR_NOT_FOUND
      );
    }
    return order;
  }

  async findAll(
    query: FilterOrderForm
  ): Promise<{ orders: Order[]; count: number }> {
    const { limit, offset } = query.getPagination();

    const { rows, count } = await this.orderRepository.findAndCountAll({
      limit: limit,
      offset: offset,
      where: query.getFilter(),
      include: [
        {
          model: OrderItem,
          include: [{ model: ProductVariant }]
        }
      ]
    });

    return { orders: rows, count };
  }

  async updateStatus(form: UpdateStatusForm) {
    const order = await this.orderRepository.findByPk(form.id);
    if (!order) {
      throw new NotFoundException(
        'Order not found',
        ErrorCode.ORDER_ERROR_NOT_FOUND
      );
    }
    if (form.status <= order.currentStatus) {
      throw new BadRequestException(
        'Status is not valid',
        ErrorCode.ORDER_ERROR_INVALID_STATUS
      );
    }
    order.currentStatus = form.status;
    await Promise.all([
      this.orderStatusService.create(form.status, order.id),
      await order.save()
    ]);
    return { message: 'Update status successfully' };
  }

  async calculateTotal(
    order: Order,
    transaction?: Transaction
  ): Promise<string> {
    const [orderItems, coupons] = await Promise.all([
      this.orderItemService.findByOrderId(order.id, transaction),
      this.couponService.findByOrderId(order.id, transaction)
    ]);
    let total = order.deliveryFee ?? '0';
    for (const item of orderItems) {
      total = bigDecimal.add(total, item.total);
    }

    for (const coupon of coupons) {
      if (coupon.type === Constant.COUPON_TYPE_FIXED) {
        total = bigDecimal.subtract(total, coupon.value);
      } else if (coupon.type === Constant.COUPON_TYPE_PERCENTAGE) {
        const discountAmount = bigDecimal.divide(
          bigDecimal.multiply(total, coupon.value),
          100
        );
        total = bigDecimal.subtract(total, discountAmount);
      }
    }
    return bigDecimal.compareTo(total, '0') < 0 ? '0' : total;
  }

  async cancel(id: bigint, accountId: bigint) {
    return await this.sequelize.transaction(async (t) => {
      const order = await this.findByIdAndAccount(id, accountId);
      if (
        order.currentStatus !== Constant.ORDER_STATUS_WAITING &&
        order.currentStatus !== Constant.ORDER_STATUS_WAITING_CONFIRMATION &&
        order.currentStatus !== Constant.ORDER_STATUS_CONFIRMED &&
        order.currentStatus !== Constant.ORDER_STATUS_PACKING
      ) {
        throw new BadRequestException(
          'Status is not valid',
          ErrorCode.ORDER_ERROR_INVALID_STATUS
        );
      }

      order.currentStatus = Constant.ORDER_STATUS_CANCELED;
      await Promise.all([
        this.orderStatusService.create(
          Constant.ORDER_STATUS_CANCELED,
          order.id,
          t
        ),
        this.orderItemService.processCancelOrderItems(order.id, t),
        await order.save({ transaction: t })
      ]);
      return { message: 'Cannel order successfully' };
    });
  }
}
