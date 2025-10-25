import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table
} from 'sequelize-typescript';
import { Auditable } from './auditable.model';
import { Account } from './account.model';
import { Product } from './product.model';
import { ProductVariant } from './product-variant.model';
import { Order } from '@/models/order.model';

@Table({
  tableName: 'db_review',
  timestamps: true
})
export class Review extends Auditable {
  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare productId: bigint;

  @BelongsTo(() => Product)
  declare product: Product;

  @ForeignKey(() => ProductVariant)
  @Column({ allowNull: true, type: DataType.BIGINT })
  declare productVariantId: bigint;

  @BelongsTo(() => ProductVariant)
  declare productVariant: ProductVariant;

  @ForeignKey(() => Order)
  @Column({ allowNull: true, type: DataType.BIGINT })
  declare orderId: bigint;

  @BelongsTo(() => ProductVariant)
  declare order: ProductVariant;

  @ForeignKey(() => Account)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare accountId: bigint;

  @BelongsTo(() => Account)
  declare account: Account;

  @Column({ type: DataType.INTEGER })
  declare rate: number;

  @Column({ type: DataType.TEXT })
  declare content: string;
}
