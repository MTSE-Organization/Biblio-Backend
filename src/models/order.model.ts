import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table
} from 'sequelize-typescript';
import { Auditable } from './auditable.model';
import { Account } from './account.model';
import { OrderItem } from './order-item.model';
import { OrderStatus } from './order-status.model';
import { Address } from './address.model';
import { OrderCoupon } from './order-coupon.model';
import { Coupon } from './coupon.model';

@Table({
  tableName: 'db_order',
  timestamps: true
})
export class Order extends Auditable {
  @ForeignKey(() => Account)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare accountId: bigint;

  @BelongsTo(() => Account)
  declare account: Account;

  @HasMany(() => OrderItem)
  declare orderItems: OrderItem[];

  @HasMany(() => OrderStatus)
  declare orderStatuses: OrderStatus[];

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare currentStatus: number;

  @Column({ type: DataType.INTEGER })
  declare paymentMethod: number;

  @Column({ type: DataType.TEXT })
  declare note: string;

  @ForeignKey(() => Address)
  @Column({ type: DataType.BIGINT })
  declare addressId: bigint;

  @BelongsTo(() => Address)
  declare address: Address;

  @BelongsToMany(() => Coupon, () => OrderCoupon)
  declare coupons: Coupon[];

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  declare deliveryFee: string;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  declare total: string;
}
