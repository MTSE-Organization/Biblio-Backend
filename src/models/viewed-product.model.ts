import { Account } from '@/models/account.model';
import { Auditable } from '@/models/auditable.model';
import { Product } from '@/models/product.model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table
} from 'sequelize-typescript';

@Table({
  tableName: 'db_viewed_product',
  timestamps: true
})
export class ViewedProduct extends Auditable {
  @Column({ type: DataType.DATE })
  declare viewedAt: Date;

  @Column({ type: DataType.BIGINT, defaultValue: 1 })
  declare viewCount: number;

  @ForeignKey(() => Account)
  @Column({ type: DataType.BIGINT })
  declare accountId: bigint;

  @ForeignKey(() => Product)
  @Column({ type: DataType.BIGINT })
  declare productId: bigint;

  @BelongsTo(() => Account)
  declare account: Account;

  @BelongsTo(() => Product)
  declare product: Product;
}
