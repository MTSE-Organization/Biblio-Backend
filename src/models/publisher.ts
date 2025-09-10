import { Column, DataType, Table } from 'sequelize-typescript';
import { Auditable } from './auditable.model';

@Table({
  tableName: 'db_publisher',
  timestamps: true
})
export class Publisher extends Auditable {
  @Column({ allowNull: false, type: DataType.STRING })
  declare name: string;

  @Column({ type: DataType.TEXT })
  declare description: string;

  @Column({ type: DataType.STRING })
  declare logoPath: string;
}
