import { Account } from '@/models/account.model';
import { Auditable } from '@/models/auditable.model';
import { ProductVariant } from '@/models/product-variant.model';
import { Product } from '@/models/product.model';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table
} from 'sequelize-typescript';

@Table({
  tableName: 'db_favorite_product',
  timestamps: true
})
export class FavoriteProduct extends Auditable {
  @ForeignKey(() => Account)
  @Column({ type: DataType.BIGINT })
  declare accountId: bigint;

  @ForeignKey(() => Product)
  @Column({ type: DataType.BIGINT })
  declare productId: bigint;

  @ForeignKey(() => ProductVariant)
  @Column({ type: DataType.BIGINT })
  declare productVariantId: bigint;

  @BelongsTo(() => Account)
  account: Account;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => ProductVariant)
  productVariant: ProductVariant;
}
