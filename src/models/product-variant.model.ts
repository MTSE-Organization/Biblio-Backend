import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table
} from 'sequelize-typescript';
import { Auditable } from './auditable.model';
import { Product } from './product.model';
import { FavoriteProduct } from '@/models/favorite-product.model';

@Table({
  tableName: 'db_product_variant',
  timestamps: true
})
export class ProductVariant extends Auditable {
  @Column({ allowNull: false, type: DataType.INTEGER })
  declare condition: number;

  @Column({ allowNull: false, type: DataType.INTEGER })
  declare format: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare quantity: number;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  declare modifiedPrice: string;

  @Column({ type: DataType.STRING })
  declare imageUrl: string;

  @ForeignKey(() => Product)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare productId: bigint;

  @BelongsTo(() => Product)
  declare product: Product;

  @HasMany(() => FavoriteProduct)
  declare favorites: FavoriteProduct[];
}
