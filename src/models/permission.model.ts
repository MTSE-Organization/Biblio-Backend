import { Column, DataType, Table } from 'sequelize-typescript';
import { Auditable } from './auditable.model';

@Table({
  tableName: 'db_permission',
  timestamps: true,
})
export class Permission extends Auditable {
  @Column({ allowNull: false, unique: true, type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.STRING, field: 'p_code' })
  pCode: string;
}
