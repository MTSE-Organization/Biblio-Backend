import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { Auditable } from './auditable.model';
import { Account } from './account.model';
import { CartItem } from './cart-item.model';

@Table({
  tableName: 'db_cart',
  timestamps: true,
})
export class Cart extends Auditable {
  @ForeignKey(() => Account)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare accountId: bigint;

  @BelongsTo(() => Account)
  declare account: Account;

  @HasMany(() => CartItem)
  declare cartItems: CartItem[];
}
