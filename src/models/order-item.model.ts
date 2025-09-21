import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table
} from 'sequelize-typescript';
import { Auditable } from './auditable.model';
import { Order } from './order.model';
import { ProductVariant } from './product-variant.model';

@Table({
  tableName: 'db_order_item',
  timestamps: true
})
export class OrderItem extends Auditable {
  @ForeignKey(() => Order)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare orderId: bigint;

  @BelongsTo(() => Order)
  declare order: Order;

  @ForeignKey(() => ProductVariant)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare productVariantId: bigint;

  @BelongsTo(() => ProductVariant)
  declare productVariant: ProductVariant;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare quantity: number;

  @Column({ type: DataType.BIGINT })
  declare cartItemId: bigint;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  declare price: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare discount: number;
}
