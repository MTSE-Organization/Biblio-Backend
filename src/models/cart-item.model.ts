import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table
} from 'sequelize-typescript';
import { Auditable } from './auditable.model';
import { Cart } from './cart.model';
import { ProductVariant } from './product-variant.model';

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

  @ForeignKey(() => ProductVariant)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare productVariantId: bigint;

  @BelongsTo(() => ProductVariant)
  declare productVariant: ProductVariant;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  declare quantity: number;
}
