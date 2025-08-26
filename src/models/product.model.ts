import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Category } from './category.model';
import { Auditable } from './auditable.model';

@Table
export class Product extends Auditable {
  @Column({ allowNull: false, type: DataType.STRING })
  name: string;

  @Column({ allowNull: false, unique: true, type: DataType.STRING })
  slug: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  description: string;

  @Column({ allowNull: false, type: DataType.FLOAT })
  price: number;

  @Column({ allowNull: false, type: DataType.STRING })
  imageUrl: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isFeatured: boolean;

  @ForeignKey(() => Category)
  @Column({ allowNull: false, type: DataType.INTEGER })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;
}
