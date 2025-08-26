import { BelongsToMany, Column, DataType, Table } from 'sequelize-typescript';
import { Permission } from './permission.model';
import { GroupPermission } from './group-permission.model';
import { Auditable } from './auditable.model';

@Table({
  tableName: 'db_group',
  timestamps: true,
})
export class Group extends Auditable {
  @Column({ allowNull: false, unique: true, type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.INTEGER })
  kind: number;

  @Column({ type: DataType.BOOLEAN })
  isSystemRole: boolean;

  @BelongsToMany(() => Permission, () => GroupPermission)
  permissions: Permission[];
}
