import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table
} from 'sequelize-typescript';
import { Category } from './category.model';
import { Auditable } from './auditable.model';
import { ProductImage } from './product-image.model';
import { Publisher } from './publisher';

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

  @Column({ allowNull: false, type: DataType.FLOAT })
  declare price: number;

  @Column({ allowNull: false, type: DataType.DATE })
  declare releaseDate: Date;

  @Column({ type: DataType.FLOAT })
  declare length: number;

  @Column({ type: DataType.FLOAT })
  declare width: number;

  @Column({ type: DataType.FLOAT })
  declare height: number;

  @Column({ type: DataType.INTEGER })
  declare ageRating: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isFeatured: boolean;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare quantity: number;

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
}
