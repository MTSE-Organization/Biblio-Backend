import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { Permission } from './permission.model';
import { GroupPermission } from './group-permission.model';
import { Auditable } from './auditable.model';
import { Account } from '@/models/account.model';

@Table({
  tableName: 'db_group',
  timestamps: true,
})
export class Group extends Auditable {
  @Column({ allowNull: false, unique: true, type: DataType.STRING })
  declare name: string;

  @Column({ type: DataType.STRING })
  declare description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare kind: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isSystemRole: boolean;

  @BelongsToMany(() => Permission, () => GroupPermission)
  declare permissions: Permission[];

  @HasMany(() => Account)
  declare accounts: Account[];
}
