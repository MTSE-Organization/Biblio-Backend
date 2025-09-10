import { Column, DataType, Table } from 'sequelize-typescript';
import { Auditable } from './auditable.model';

@Table({
  tableName: 'db_category',
  timestamps: true
})
export class Category extends Auditable {
  @Column({ allowNull: false, type: DataType.STRING })
  declare name: string;

  @Column({ allowNull: false, type: DataType.STRING })
  declare slug: string;

  @Column({ type: DataType.TEXT })
  declare description: string;

  @Column({ type: DataType.STRING })
  declare imageUrl: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare ordering: number;
}
