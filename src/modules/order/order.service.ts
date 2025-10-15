import {
  Account,
  Address,
  Coupon,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductVariant
} from '@/models';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
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
import { Constant, ErrorCode, OrderTransitions } from '@/constants';
import { OrderItemService } from './order-item.service';
import { OrderStatusService } from './order-status.service';
import { Sequelize, Transaction, where } from 'sequelize';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { CouponService } from '../coupon/coupon.service';
import bigDecimal from 'js-big-decimal';
import { CreateOrderDto } from './dtos';
import { NotificationService } from '../notification/notification.service';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order)
    private readonly orderRepository: typeof Order,
    private readonly orderItemService: OrderItemService,
    private readonly orderStatusService: OrderStatusService,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    @Inject(forwardRef(() => AddressService))
    private readonly addressService: AddressService,
    private readonly couponService: CouponService,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
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
      // check coupons
      const coupons = await this.couponService.findByIds(form.couponIds);
      if (!this.couponService.checkValid(coupons)) {
        throw new BadRequestException(
          'Coupon is not valid',
          ErrorCode.COUPON_ERROR_INVALID
        );
      }

      // create order
      const order = await this.orderRepository.create(
        {
          accountId: form.accountId
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
      const [address, weight] = await Promise.all([
        this.addressService.findById(form.addressId, accountId),
        this.orderItemService.calculateTotalWeight(order.id)
      ]);

      order.deliveryFee = (
        await this.addressService.calculateShippingFee(address, weight)
      ).toString();
      order.addressId = form.addressId;

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
        order.update({ note: form.note }),
        this.couponService.decreaseQuantity(coupons, t)
      ]);

      // update information
      order.paymentMethod = form.paymentMethod;
      order.total = await this.calculateTotal(order, t);

      let paymentUrl: string | null = null;
      // payment method cod
      if (form.paymentMethod === Constant.PAYMENT_METHOD_COD) {
        order.currentStatus = Constant.ORDER_STATUS_WAITING_CONFIRMATION;
        await this.orderStatusService.create(
          Constant.ORDER_STATUS_WAITING_CONFIRMATION,
          order.id,
          t
        );
        await this.orderItemService.processOrderItems(order.id, t);
        // send-noti new order for all admin and employee
        this.notificationService
          .sendPlaceOrder(order)
          .catch((err) => this.logger.error('SendPlaceOrder error', err));
      } else {
        order.currentStatus = Constant.ORDER_STATUS_WAITING_PAYMENT;
        // call to VNPAY API
        await this.orderStatusService.create(
          Constant.ORDER_STATUS_WAITING_PAYMENT,
          order.id,
          t
        );
        paymentUrl = this.paymentService.getPaymentUrl(order);
      }

      await order.save({ transaction: t });

      return { data: { paymentUrl }, message: 'Place order successfully' };
    });
  }

  async findByIdAndAccount(id: bigint, accountId: bigint) {
    const order = await this.orderRepository.findOne({
      where: { id, accountId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: ProductVariant,
              include: [{ model: Product }]
            }
          ]
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
          include: [
            {
              model: ProductVariant,
              include: [{ model: Product }]
            }
          ]
        },
        { model: OrderStatus },
        { model: Address },
        { model: Coupon },
        { model: Account }
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
          include: [
            {
              model: ProductVariant,
              include: [
                {
                  model: Product
                }
              ]
            }
          ]
        },
        { model: Account }
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
    const status = this.getNextStatus(form.cmd, order.currentStatus);
    order.currentStatus = status;
    await Promise.all([
      this.orderStatusService.create(status, order.id),
      order.save()
    ]);
    return { message: 'Update status successfully' };
  }

  getNextStatus(cmd: string, currentStatus: number): number {
    const transition = OrderTransitions[cmd];
    if (!transition.from.includes(currentStatus)) {
      throw new BadRequestException(
        'Status is not valid',
        ErrorCode.ORDER_ERROR_INVALID_STATUS
      );
    }
    return transition.to;
  }

  async calculateTotal(
    order: Order,
    transaction?: Transaction
  ): Promise<string> {
    const [orderItems, coupons] = await Promise.all([
      this.orderItemService.findByOrderId(order.id, transaction),
      this.couponService.findByOrderId(order.id, transaction)
    ]);
    let subtotal = '0';
    for (const item of orderItems) {
      subtotal = bigDecimal.add(subtotal, item.total);
    }
    const deliveryFee = order.deliveryFee ?? '0';
    let total = bigDecimal.add(subtotal, deliveryFee);

    for (const coupon of coupons) {
      if (bigDecimal.compareTo(subtotal, coupon.minOrderAmount ?? '0') < 0) {
        throw new BadRequestException(
          'COUPON_ERROR_INVALID',
          ErrorCode.COUPON_ERROR_INVALID
        );
      }

      const baseAmount =
        coupon.kind === Constant.COUPON_KIND_DISCOUNT ? subtotal : deliveryFee;
      const couponAmount = this.couponService.getCouponAmount(
        baseAmount,
        coupon.type,
        coupon.value
      );

      total = bigDecimal.subtract(total, couponAmount);
    }
    return total;
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
        this.orderItemService.handleCancelOrderItems(order.id, t),
        order.save({ transaction: t })
      ]);
      return { message: 'Cannel order successfully' };
    });
  }

  async complete(id: bigint, accountId: bigint) {
    return await this.sequelize.transaction(async (t) => {
      const order = await this.findByIdAndAccount(id, accountId);
      if (order.currentStatus !== Constant.ORDER_STATUS_COMPLETE) {
        throw new BadRequestException(
          'Status is not valid',
          ErrorCode.ORDER_ERROR_INVALID_STATUS
        );
      }

      order.currentStatus = Constant.ORDER_STATUS_RECEIVED;
      await Promise.all([
        this.orderStatusService.create(
          Constant.ORDER_STATUS_RECEIVED,
          order.id,
          t
        ),
        this.orderItemService.handleCompleteOrder(order.id, t),
        order.save({ transaction: t })
      ]);
      return { message: 'Complete order successfully' };
    });
  }

  async handleNewOrder(orderId: bigint) {
    const order = await this.orderRepository.findByPk(orderId);
    if (!order) {
      throw new NotFoundException(
        'Order not found',
        ErrorCode.ORDER_ERROR_NOT_FOUND
      );
    }
    order.currentStatus = Constant.ORDER_STATUS_WAITING_CONFIRMATION;

    await Promise.all([
      this.orderStatusService.create(
        Constant.ORDER_STATUS_WAITING_CONFIRMATION,
        order.id
      ),
      this.orderItemService.processOrderItems(order.id),
      order.save()
    ]);

    // send-noti new order for all admin and employee
    this.notificationService
      .sendPlaceOrder(order)
      .catch((err) => this.logger.error('SendPlaceOrder error', err));
  }
}
