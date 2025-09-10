import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table
} from 'sequelize-typescript';
import { Auditable } from './auditable.model';
import { Product } from './product.model';
import { Cart } from './cart.model';

@Table({
  tableName: 'db_cart_item',
  timestamps: true
})
export class CartItem extends Auditable {
  @ForeignKey(() => Cart)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare cartId: bigint;

  @BelongsTo(() => Cart)
  declare cart: Cart;

  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare productId: bigint;

  @BelongsTo(() => Product)
  declare product: Product;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare quantity: number;
}
