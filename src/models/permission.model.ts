import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Auditable } from './auditable.model';
import { PermissionGroup } from './permission-group.model';

@Table({
  tableName: 'db_permission',
  timestamps: true,
})
export class Permission extends Auditable {
  @Column({ allowNull: false, unique: true, type: DataType.STRING })
  declare name: string;

  @Column({ allowNull: false, type: DataType.STRING })
  declare description: string;

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING,
    field: 'p_code',
  })
  declare pCode: string;

  @ForeignKey(() => PermissionGroup)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare permissionGroupId: bigint;

  @BelongsTo(() => PermissionGroup)
  declare permissionGroup: PermissionGroup;
}
