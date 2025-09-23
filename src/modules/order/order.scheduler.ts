import { Order, OrderItem, OrderStatus } from '@/models';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class OrderScheduler {
  private readonly logger = new Logger(OrderScheduler.name);

  constructor(
    @InjectModel(Order)
    private readonly orderRepository: typeof Order,

    @InjectModel(OrderItem)
    private readonly orderItemRepository: typeof OrderItem,

    @InjectModel(OrderStatus)
    private readonly orderStatusRepository: typeof OrderStatus,

    @InjectConnection() private readonly sequelize: Sequelize
  ) {}

  @Cron('0 0 0 * * *') // 00:00
  async checkPendingOrders() {
    this.logger.log('Start clean up pending order');

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    await this.sequelize.transaction(async (t) => {
      const orderIds = await this.orderRepository
        .findAll({
          where: {
            currentStatus: 0,
            createdDate: {
              [Op.lt]: oneDayAgo
            }
          },
          attributes: ['id'],
          raw: true,
          transaction: t
        })
        .then((rows) => rows.map((r) => r.id));

      if (orderIds.length > 0) {
        await Promise.all([
          this.orderItemRepository.destroy({
            where: { orderId: { [Op.in]: orderIds } },
            transaction: t
          }),
          this.orderStatusRepository.destroy({
            where: { orderId: { [Op.in]: orderIds } },
            transaction: t
          })
        ]);

        await this.orderRepository.destroy({
          where: { id: { [Op.in]: orderIds } },
          transaction: t
        });
      }
    });
    this.logger.log('Ending clean up pending order');
  }
}
