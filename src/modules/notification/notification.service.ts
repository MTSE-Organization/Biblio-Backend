import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilterNotificationForm } from './forms';
import { Notification } from '@/models/notification.model';
import { Account, Order } from '@/models';
import { AccountService } from '../account/account.service';
import { Constant, ErrorCode } from '@/constants';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';
import { MapperUtil } from '@/utils';
import { AccountShortDto } from '../account/dtos';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { NotificationType } from './types';

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

  async sendOrderNotification(
    order: Order,
    type: number,
    imageUrl?: string,
    title?: string,
    content?: string
  ) {
    const customer: Account = await this.accountService.findById(
      order.accountId
    );
    title =
      title || this.getNotificationTitleByStatus(order.currentStatus, order.id);
    content =
      content ||
      this.getNotificationContentByStatus(
        order.currentStatus,
        order.id,
        customer.email
      );

    const notification: NotificationType = {
      title: title,
      imageUrl: imageUrl,
      content: content,
      type: Constant.NOTIFICATION_TYPE_ORDER,
      data: JSON.stringify({
        orderId: order.id,
        customer: MapperUtil.toDto(customer, AccountShortDto)
      })
    };
    if (type === Constant.NOTIFICATION_FOR_EMPLOYEE) {
      await this.handleSendNotificationEmployee(notification);
    } else {
      notification.accountId = customer.id;
      await this.handleSendNotificationCustomer(notification);
    }
  }

  async handleSendNotificationEmployee(notification: NotificationType) {
    console.log(notification);

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

  getNotificationTitleByStatus(status: number, id: bigint): string {
    console.log({ status });

    switch (status) {
      case Constant.ORDER_STATUS_WAITING_CONFIRMATION:
        return `Đơn hàng #${id} đang chờ xác nhận`;
      case Constant.ORDER_STATUS_CONFIRMED:
        return `Đơn hàng #${id} đã được xác nhận`;
      case Constant.ORDER_STATUS_PACKING:
        return `Đơn hàng #${id} đang được đóng gói`;
      case Constant.ORDER_STATUS_SHIPPING:
        return `Đơn hàng #${id} đang được vận chuyển`;
      case Constant.ORDER_STATUS_COMPLETE:
        return `Đơn hàng ${id} đã được giao thành công`;
      case Constant.ORDER_STATUS_RECEIVED:
        return `Đơn hàng ${id} đã được nhận`;
      case Constant.ORDER_STATUS_REQUEST_REFUND:
        return `Đơn hàng #${id} được yêu cầu hoàn trả`;
      case Constant.ORDER_STATUS_REFUNDED:
        return `Đơn hàng #${id} đã được hoàn trả`;
      case Constant.ORDER_STATUS_CANCELED:
        return `Đơn hàng #${id} đã bị hủy`;
      default:
        throw new BadRequestException(
          'Invalid order status',
          ErrorCode.ORDER_ERROR_INVALID_STATUS
        );
    }
  }

  getNotificationContentByStatus(
    status: number,
    id: bigint,
    email: string
  ): string {
    switch (status) {
      case Constant.ORDER_STATUS_WAITING_CONFIRMATION:
        return `Khách hàng ${email} đã đặt đơn hàng #${id}. Vui lòng kiểm tra và xác nhận.`;
      case Constant.ORDER_STATUS_CONFIRMED:
        return `Đơn hàng #${id} của bạn đã được cửa hàng xác nhận. Cảm ơn bạn đã đặt hàng!`;
      case Constant.ORDER_STATUS_PACKING:
        return `Đơn hàng #${id} của bạn đang được cửa hàng đóng gói và chuẩn bị giao.`;
      case Constant.ORDER_STATUS_SHIPPING:
        return `Đơn hàng #${id} của bạn đang trên đường giao đến. Vui lòng chú ý điện thoại để nhận hàng.`;
      case Constant.ORDER_STATUS_COMPLETE:
        return `Đơn hàng #${id} đã được giao thành công. Vui lòng nhận hàng.`;
      case Constant.ORDER_STATUS_RECEIVED:
        return `Khách hàng ${email} đã nhận đơn hàng #${id}.`;
      case Constant.ORDER_STATUS_REQUEST_REFUND:
        return `Khách hàng ${email} đã gửi yêu cầu hoàn trả cho đơn hàng #${id}. Vui lòng kiểm tra và xử lý.`;
      case Constant.ORDER_STATUS_REFUNDED:
        return `Đơn hàng #${id} của bạn đã được hoàn trả thành công. Cảm ơn bạn đã kiên nhẫn!`;
      case Constant.ORDER_STATUS_CANCELED:
        return `Đơn hàng #${id} của bạn đã bị hủy theo yêu cầu. Nếu có thắc mắc, vui lòng liên hệ cửa hàng.`;
      default:
        throw new BadRequestException(
          'Invalid order status',
          ErrorCode.ORDER_ERROR_INVALID_STATUS
        );
    }
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
