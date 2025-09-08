import { Column, DataType, Table } from 'sequelize-typescript';
import { Auditable } from './auditable.model';

@Table({
  tableName: 'db_permission_group',
  timestamps: true,
})
export class PermissionGroup extends Auditable {
  @Column({ allowNull: false, unique: true, type: DataType.STRING })
  declare name: string;
}
