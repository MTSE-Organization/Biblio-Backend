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
import { Sequelize } from 'sequelize';
import { BadRequestException, NotFoundException } from '@/common/exceptions';

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
          addressId: address.id
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

      return { message: 'Create order successfully', orderId: order.id };
    });
  }

  async createFromCart(form: CreateOrderFromCartForm) {
    return await this.sequelize.transaction(async (t) => {
      let address: Address;
      if (form.addressId) {
        address = await this.addressService.findById(
          form.addressId,
          form.accountId
        );
      } else {
        address = await this.addressService.findByAccountIdAndDefault(
          form.accountId
        );
      }
      // get coupon

      const order = await this.orderRepository.create(
        {
          accountId: form.accountId,
          addressId: address.id
        },
        { transaction: t }
      );
      await this.orderItemService.createMany(form.cartItems, order.id, t);

      await this.orderStatusService.create(
        Constant.ORDER_STATUS_WAITING,
        order.id,
        t
      );
      return { message: 'Create order successfully', orderId: order.id };
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
        await this.addressService.findById(form.addressId, accountId);
        order.addressId = form.addressId;
      }
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
}
