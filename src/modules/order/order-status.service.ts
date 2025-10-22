import { NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants';
import { OrderStatus } from '@/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectModel(OrderStatus)
    private readonly orderStatusRepository: typeof OrderStatus
  ) {}

  async create(status: number, orderId: bigint, transaction?: Transaction) {
    await this.orderStatusRepository.create(
      {
        orderId: orderId,
        status: status
      },
      {
        ...(transaction && { transaction })
      }
    );
  }

  async findByOrderIdAndStatus(
    orderId: bigint,
    status: number
  ): Promise<OrderStatus> {
    const orderStatus = await this.orderStatusRepository.findOne({
      where: {
        orderId: orderId,
        status: status
      }
    });
    if (!orderStatus) {
      throw new NotFoundException(
        'Order status not found',
        ErrorCode.ORDER_STATUS_ERROR_NOT_FOUND
      );
    }
    return orderStatus;
  }
}
