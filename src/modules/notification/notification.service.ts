import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilterNotificationForm } from './forms';
import { Notification } from '@/models/notification.model';
import { Order } from '@/models';
import { AccountService } from '../account/account.service';
import { Constant, ErrorCode } from '@/constants';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { OrderItemService } from '../order/order-item.service';
import { MapperUtil } from '@/utils';
import { AccountShortDto } from '../account/dtos';
import { NotFoundException } from '@/common/exceptions';
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
      where: query.getFilter()
    });
    return { notifications: rows, count };
  }

  async countUnRead(accountId: bigint) {
    return this.notificationRepository.count({
      where: {
        accountId,
        seen: false
      }
    });
  }

  async sendPlaceOrder(order: Order, imageUrl?: string) {
    const customer = await this.accountService.findById(order.accountId);

    const notification = {
      title: 'Order place',
      imageUrl: imageUrl,
      content: `New order ${order.id} place from user ${order.accountId}`,
      type: Constant.NOTIFICATION_TYPE_ORDER,
      data: JSON.stringify({
        orderId: order.id,
        customer: MapperUtil.toDto(customer, AccountShortDto)
      })
    };

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
    const notifications = await this.notificationRepository.findAll({
      where: {
        accountId,
        status: { [Op.ne]: Constant.STATUS_DELETED }
      }
    });

    if (!notifications.length) return { message: 'No notifications to delete' };

    await this.notificationRepository.update(
      { status: Constant.STATUS_DELETED },
      {
        where: {
          accountId,
          status: { [Op.ne]: Constant.STATUS_DELETED }
        }
      }
    );
    return { message: 'Delete all notifications successfully' };
  }
}
