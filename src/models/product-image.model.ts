import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Auditable } from './auditable.model';
import { Product } from './product.model';

@Table({
  tableName: 'db_product_image',
  timestamps: true,
})
export class ProductImage extends Auditable {
  @Column({ allowNull: false, type: DataType.STRING })
  declare url: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare ordering: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isDefault: boolean;

  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare productId: bigint;

  @BelongsTo(() => Product)
  declare product: Product;
}
