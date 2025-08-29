import { Column, DataType, Table } from 'sequelize-typescript';
import { Auditable } from './auditable.model';

@Table({
  tableName: 'db_category',
  timestamps: true,
})
export class Category extends Auditable {
  @Column({ allowNull: false, type: DataType.STRING })
  name: string;

  @Column({ allowNull: false, type: DataType.STRING })
  slug: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  ordering: number;
}
