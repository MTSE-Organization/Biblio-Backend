import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilterNotificationForm } from './forms';
import { Notification } from '@/models/notification.model';
import { Account, Order } from '@/models';
import { AccountService } from '../account/account.service';
import { Constant, ErrorCode } from '@/constants';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { OrderItemService } from '../order/order-item.service';
import { MapperUtil } from '@/utils';
import { AccountShortDto } from '../account/dtos';
import { NotFoundException } from '@/common/exceptions';
import { NotificationType } from './types';
import { Op } from 'sequelize';


@Injectable()
export class NotificationService {
  private notificationQueue: string;

  constructor(
    @InjectModel(Notification)
    private readonly notificationRepository: typeof Notification,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    private readonly configService: ConfigService,
    private readonly rabbitmqService: RabbitmqService
  ) {
    this.notificationQueue = this.configService.get<string>(
      'RABBITMQ_NOTIFICATION_QUEUE'
    )!;
  }

  async list(
    query: FilterNotificationForm
  ): Promise<{ notifications: Notification[]; count: number }> {
    const { limit, offset } = query.getPagination();

    const { rows, count } = await this.notificationRepository.findAndCountAll({
      limit: limit,
      offset: offset,
      where: query.getFilter(),
      order: [['createdDate', 'DESC']]
    });
    return { notifications: rows, count };
  }

  async countUnread(accountId: bigint) {
    return this.notificationRepository.count({
      where: {
        accountId,
        seen: 0
      }
    });
  }

  async sendPlaceOrder(order: Order, imageUrl?: string) {
    const customer = await this.accountService.findById(order.accountId);

    const notification: NotificationType = {
      title: 'Order place',
      imageUrl: imageUrl,
      content: `New order ${order.id} place from user ${order.accountId}`,
      type: Constant.NOTIFICATION_TYPE_ORDER,
      data: JSON.stringify({
        orderId: order.id,
        customer: MapperUtil.toDto(customer, AccountShortDto)
      })
    };

    await this.handleSendNotificationEmployee(notification);
  }

  async sendRefundOrder(order: Order, imageUrl?: string) {
    const customer = await this.accountService.findById(order.accountId);

    const notification: NotificationType = {
      title: 'Order refund request',
      imageUrl: imageUrl,
      content: `Request refund order ${order.id} from user ${order.accountId}`,
      type: Constant.NOTIFICATION_TYPE_ORDER,
      data: JSON.stringify({
        orderId: order.id,
        customer: MapperUtil.toDto(customer, AccountShortDto)
      })
    };

    await this.handleSendNotificationEmployee(notification);
  }

  async sendDeliveryOrder(order: Order, imageUrl?: string) {
    const customer = await this.accountService.findById(order.accountId);

    const notification: NotificationType = {
      title: 'Order delivery',
      imageUrl: imageUrl,
      content: `Order ${order.id} has been delivered to user ${order.accountId}`,
      type: Constant.NOTIFICATION_TYPE_ORDER,
      data: JSON.stringify({
        orderId: order.id,
        customer: MapperUtil.toDto(customer, AccountShortDto)
      }),
      accountId: customer.id
    };

    await this.handleSendNotificationCustomer(notification);
  }

  async sendRefundedOrder(order: Order, imageUrl?: string) {
    const customer = await this.accountService.findById(order.accountId);

    const notification: NotificationType = {
      title: 'Order refunded',
      imageUrl: imageUrl,
      content: `Order ${order.id} has been refunded for user ${order.accountId}`,
      type: Constant.NOTIFICATION_TYPE_ORDER,
      data: JSON.stringify({
        orderId: order.id,
        customer: MapperUtil.toDto(customer, AccountShortDto)
      }),
      accountId: customer.id
    };

    await this.handleSendNotificationCustomer(notification);
  }

  async handleSendNotificationEmployee(notification: NotificationType) {
    const [accounts, _] = await Promise.all([
      this.accountService.findAllByKindIn([
        Constant.ACCOUNT_KIND_ADMIN,
        Constant.ACCOUNT_KIND_EMPLOYEE
      ]),
      this.rabbitmqService.handleSendMsg(
        Constant.BACKEND_APP,
        this.notificationQueue,
        JSON.stringify(notification),
        Constant.CMD_BROADCAST,
        Constant.CMD_NOTIFICATION_NEW_ORDER
      )
    ]);

    const notifications = accounts.map((account) => ({
      accountId: account.id,
      ...notification
    }));

    await this.notificationRepository.bulkCreate(notifications, {
      individualHooks: true
    });
  }

  async handleSendNotificationCustomer(notification: NotificationType) {
    await this.rabbitmqService.handleSendMsg(
      Constant.BACKEND_APP,
      this.notificationQueue,
      JSON.stringify(notification),
      Constant.CMD_NOTIFICATION_CUSTOMER,
      null
    );
    const data = {
      accountId: notification.accountId,
      ...notification
    };

    await this.notificationRepository.create(data);
  }

  async markRead(id: bigint) {
    const notification = await this.notificationRepository.findByPk(id);
    if (!notification)
      throw new NotFoundException(
        'Notification not found',
        ErrorCode.NOTIFICATION_ERROR_NOT_FOUND
      );

    await notification.update({ seen: true, lastTimeRead: new Date() });
  }

  async markAllRead(accountId: bigint) {
    await this.notificationRepository.update(
      { seen: true, lastTimeRead: new Date() },
      {
        where: {
          accountId,
          seen: false
        }
      }
    );
  }

  async deleteAllByAccountId(accountId: bigint) {
    const count = await this.notificationRepository.destroy({
      where: {
        accountId
      }
    });

    return { message: `Deleted ${count} notifications successfully` };
  }

  async delete(id: bigint, accountId: bigint) {
    const notification = await this.notificationRepository.findOne({
      where: { id, accountId }
    });

    if (!notification)
      throw new NotFoundException(
        'Notification not found',
        ErrorCode.NOTIFICATION_ERROR_NOT_FOUND
      );

    await notification.destroy();
  }
}
