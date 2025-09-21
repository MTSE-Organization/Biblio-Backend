import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { Order } from './order.model';
import { Coupon } from './coupon.model';

@Table({
  tableName: 'db_order_coupon',
  timestamps: false
})
export class OrderCoupon extends Model<OrderCoupon> {
  @ForeignKey(() => Order)
  @Column({ type: DataType.BIGINT, allowNull: true })
  declare orderId: bigint;

  @ForeignKey(() => Coupon)
  @Column({ type: DataType.BIGINT, allowNull: true })
  declare couponId: bigint;
}
