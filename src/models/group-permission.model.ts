import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript';
import { Group } from './group.model';
import { Permission } from './permission.model';

@Table({
  tableName: 'db_group_permission',
  timestamps: false
})
export class GroupPermission extends Model<GroupPermission> {
  @ForeignKey(() => Group)
  @Column({ type: DataType.BIGINT, primaryKey: true })
  groupId: bigint;

  @ForeignKey(() => Permission)
  @Column({ type: DataType.BIGINT, primaryKey: true })
  permissionId: bigint;
}
