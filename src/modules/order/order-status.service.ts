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
}
