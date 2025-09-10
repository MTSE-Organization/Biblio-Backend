import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { Product } from './product.model';
import { Contributor } from './contributor';

@Table({
  tableName: 'db_product_contributor',
  timestamps: false
})
export class ProductContributor extends Model<ProductContributor> {
  @ForeignKey(() => Product)
  @Column({ type: DataType.BIGINT, primaryKey: true })
  productId: bigint;

  @ForeignKey(() => Contributor)
  @Column({ type: DataType.BIGINT, primaryKey: true })
  contributorId: bigint;
}
