import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table
} from 'sequelize-typescript';
import { Auditable } from './auditable.model';
import { Order } from './order.model';

@Table({
  tableName: 'db_order_status',
  timestamps: true
})
export class OrderStatus extends Auditable {
  @ForeignKey(() => Order)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare orderId: bigint;

  @BelongsTo(() => Order)
  declare order: Order;
}
