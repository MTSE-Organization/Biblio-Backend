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
  FilterOrderType,
  PlaceOrderForm,
  RefundOrderForm,
  UpdateStatusForm
} from './forms';
import { AccountService } from '../account/account.service';
import { AddressService } from '../address/address.service';
import { Constant, ErrorCode, OrderTransitions } from '@/constants';
import { OrderItemService } from './order-item.service';
import { OrderStatusService } from './order-status.service';
import { Op, Sequelize, Transaction, where } from 'sequelize';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { CouponService } from '../coupon/coupon.service';
import bigDecimal from 'js-big-decimal';
import {
  CreateOrderDto,
  OrderStatisticStatusDto,
  OrderStatisticStatusItemDto
} from './dtos';
import { NotificationService } from '../notification/notification.service';
import { PaymentService } from '../payment/payment.service';
import { FilterRevenueForm } from './forms/filter-revenue.form';
import { RevenueOrderDto } from './dtos/revenue-order.dto';
import { title } from 'process';

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

      if (order.paymentStatus === Constant.PAYMENT_STATUS_PENDING) {
        return {
          data: { paymentUrl: this.paymentService.getPaymentUrl(order) },
          message: 'Place order successfully'
        };
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
        const orderItem = await this.orderItemService.findFirstByOrderId(
          order.id
        );
        const imageUrl = orderItem?.productVariant.imageUrl;
        this.notificationService
          .sendOrderNotification(
            order,
            Constant.NOTIFICATION_FOR_EMPLOYEE,
            imageUrl
          )
          .catch((err) => this.logger.error('send notification error', err));
      } else {
        order.paymentStatus = Constant.PAYMENT_STATUS_PENDING;
        // call to VNPAY API
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
    const orderItem = await this.orderItemService.findFirstByOrderId(order.id);
    const imageUrl = orderItem?.productVariant.imageUrl;
    if (form.cmd === Constant.CMD_REJECT_REFUNDED) {
      order.currentStatus = Constant.ORDER_STATUS_RECEIVED;
      await Promise.all([
        this.orderStatusService.deleteByOrderIdAndStatus(
          order.id,
          Constant.ORDER_STATUS_REQUEST_REFUND
        ),
        order.save()
      ]);

      // send notification reject refund for customer
      this.notificationService
        .sendOrderNotification(
          order,
          Constant.NOTIFICATION_FOR_CUSTOMER,
          imageUrl,
          `Yêu cầu hoàn trả đơn hàng #${order.id} bị từ chối`,
          `Yêu cầu hoàn trả đơn hàng #${order.id} của bạn đã bị từ chối. Nếu có thắc mắc, vui lòng liên hệ cửa hàng.`
        )
        .catch((err) => this.logger.error('send notification error', err));
      return { message: 'Update status successfully' };
    }
    const status = this.getNextStatus(form.cmd, order.currentStatus);
    order.currentStatus = status;
    await Promise.all([
      this.orderStatusService.create(status, order.id),
      order.save()
    ]);

    // send notification for customer
    this.notificationService
      .sendOrderNotification(
        order,
        Constant.NOTIFICATION_FOR_CUSTOMER,
        imageUrl
      )
      .catch((err) => this.logger.error('send notification error', err));

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

      const orderItem = await this.orderItemService.findFirstByOrderId(
        order.id
      );
      const imageUrl = orderItem?.productVariant.imageUrl;

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
      // send notification for customer
      this.notificationService
        .sendOrderNotification(
          order,
          Constant.NOTIFICATION_FOR_EMPLOYEE,
          imageUrl
        )
        .catch((err) => this.logger.error('send notification error', err));
      return { message: 'Complete order successfully' };
    });
  }

  async refund(form: RefundOrderForm, accountId: bigint) {
    return await this.sequelize.transaction(async (t) => {
      const order = await this.findByIdAndAccount(form.id, accountId);
      if (order.currentStatus !== Constant.ORDER_STATUS_RECEIVED) {
        throw new BadRequestException(
          'Status is not valid',
          ErrorCode.ORDER_ERROR_INVALID_STATUS
        );
      }

      const orderStatus = await this.orderStatusService.findByOrderIdAndStatus(
        order.id,
        Constant.ORDER_STATUS_RECEIVED
      );
      const now = new Date();
      const diffTime = now.getTime() - orderStatus?.createdDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays > 3) {
        throw new BadRequestException(
          'Order cannot be refunded',
          ErrorCode.ORDER_ERROR_CANNOT_REFUND
        );
      }

      order.currentStatus = Constant.ORDER_STATUS_REQUEST_REFUND;
      order.refundReason = form.refundReason;
      await this.orderStatusService.create(
        Constant.ORDER_STATUS_REQUEST_REFUND,
        order.id,
        t
      );
      await order.save({ transaction: t });

      // send-noti request refund order for all admin and employee
      const orderItem = await this.orderItemService.findFirstByOrderId(
        order.id
      );
      const imageUrl = orderItem?.productVariant.imageUrl;

      this.notificationService
        .sendOrderNotification(
          order,
          Constant.NOTIFICATION_FOR_EMPLOYEE,
          imageUrl
        )
        .catch((err) => this.logger.error('send notification error', err));

      return { message: 'Refund order successfully' };
    });
  }

  async handleNewOrder(orderId: bigint, isPaymentSuccess: boolean) {
    const order = await this.orderRepository.findByPk(orderId);
    if (!order) {
      throw new NotFoundException(
        'Order not found',
        ErrorCode.ORDER_ERROR_NOT_FOUND
      );
    }
    order.currentStatus = Constant.ORDER_STATUS_WAITING_CONFIRMATION;
    order.paymentStatus = isPaymentSuccess
      ? Constant.PAYMENT_STATUS_SUCCESS
      : Constant.PAYMENT_STATUS_FAILED;

    await Promise.all([
      this.orderStatusService.create(
        Constant.ORDER_STATUS_WAITING_CONFIRMATION,
        order.id
      ),
      this.orderItemService.processOrderItems(order.id),
      order.save()
    ]);

    const orderItem = await this.orderItemService.findFirstByOrderId(order.id);
    const imageUrl = orderItem?.productVariant.imageUrl;

    if (isPaymentSuccess) {
      // send-noti new order for all admin and employee
      await this.notificationService
        .sendOrderNotification(
          order,
          Constant.NOTIFICATION_FOR_EMPLOYEE,
          imageUrl
        )
        .catch((err) => this.logger.error('send notification error', err));
    }
  }

  async getRevenue(form: FilterRevenueForm): Promise<RevenueOrderDto> {
    const where: any = {
      currentStatus: Constant.ORDER_STATUS_RECEIVED
    };

    if (form.fromDate && form.toDate && form.toDate < form.fromDate) {
      throw new BadRequestException(
        'toDate must be greater than or equal to fromDate'
      );
    }

    if (form.fromDate || form.toDate) {
      where.createdDate = {};
      if (form.fromDate) where.createdDate[Op.gte] = form.fromDate;
      if (form.toDate) where.createdDate[Op.lte] = form.toDate;
    }

    const orders = await this.orderRepository.findAll({
      where,
      attributes: ['total']
    });

    let totalRevenue = '0';
    for (const order of orders) {
      totalRevenue = bigDecimal.add(totalRevenue, order.total);
    }

    return {
      totalRevenue,
      totalOrders: orders.length
    };
  }

  async getOrderStatusDistribution(
    form: FilterOrderType
  ): Promise<OrderStatisticStatusDto> {
    const where: any = {};

    if (form.fromDate && form.toDate && form.toDate < form.fromDate) {
      throw new BadRequestException(
        'toDate must be greater than or equal to fromDate'
      );
    }

    if (form.fromDate || form.toDate) {
      where.createdDate = {};
      if (form.fromDate) where.createdDate[Op.gte] = form.fromDate;
      if (form.toDate) where.createdDate[Op.lte] = form.toDate;
    }

    const totalOrders = await this.orderRepository.count({ where });

    const validStatuses = this.getValidOrderStatuses();

    const items: OrderStatisticStatusItemDto[] = [];

    for (const status of validStatuses) {
      const total = await this.orderRepository.count({
        where: { ...where, currentStatus: status }
      });

      const percentage =
        totalOrders === 0
          ? 0
          : Number(((total / totalOrders) * 100).toFixed(2));

      items.push({
        status,
        total,
        percentage
      });
    }

    return {
      status: items,
      totalOrders
    };
  }

  private getValidOrderStatuses(): number[] {
    return [
      Constant.ORDER_STATUS_WAITING,
      Constant.ORDER_STATUS_WAITING_CONFIRMATION,
      Constant.ORDER_STATUS_CONFIRMED,
      Constant.ORDER_STATUS_PACKING,
      Constant.ORDER_STATUS_SHIPPING,
      Constant.ORDER_STATUS_COMPLETE,
      Constant.ORDER_STATUS_RECEIVED,
      Constant.ORDER_STATUS_CANCELED,
      Constant.ORDER_STATUS_REQUEST_REFUND,
      Constant.ORDER_STATUS_REFUNDED
    ];
  }
}
