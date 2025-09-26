import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table
} from 'sequelize-typescript';
import { Category } from './category.model';
import { Auditable } from './auditable.model';
import { ProductImage } from './product-image.model';
import { Publisher } from './publisher.model';
import { Contributor } from './contributor.model';
import { ProductContributor } from './product-contributor.model';
import { FavoriteProduct } from '@/models/favorite-product.model';
import { ViewedProduct } from '@/models/viewed-product.model';

@Table({
  tableName: 'db_product',
  timestamps: true
})
export class Product extends Auditable {
  @Column({ allowNull: false, type: DataType.STRING })
  declare name: string;

  @Column({ allowNull: false, type: DataType.STRING })
  declare slug: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  declare description: string;

  @Column({ allowNull: false, type: DataType.DECIMAL(10, 2) })
  declare price: string;

  @Column({ allowNull: false, type: DataType.DATE })
  declare releaseDate: Date;

  @Column({ type: DataType.INTEGER })
  declare ageRating: number;

  @Column({ type: DataType.STRING })
  declare language: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isFeatured: boolean;

  @Column({ type: DataType.TEXT })
  declare metaData: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare discount: number;

  @ForeignKey(() => Category)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare categoryId: bigint;

  @BelongsTo(() => Category)
  declare category: Category;

  @HasMany(() => ProductImage)
  declare images: ProductImage[];

  @ForeignKey(() => Publisher)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare publisherId: bigint;

  @BelongsTo(() => Publisher)
  declare publisher: Publisher;

  @BelongsToMany(() => Contributor, () => ProductContributor)
  declare contributors: Contributor[];

  @HasMany(() => FavoriteProduct)
  declare favorites: FavoriteProduct[];

  @HasMany(() => ViewedProduct)
  declare viewedProducts: ViewedProduct[];
}
