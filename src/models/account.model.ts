import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table
} from 'sequelize-typescript';
import { Auditable } from './auditable.model';
import { Group } from './group.model';

@Table({
  tableName: 'db_account',
  timestamps: true
})
export class Account extends Auditable {
  @Column({ allowNull: false, unique: true, type: DataType.STRING })
  declare email: string;

  @Column({ allowNull: false, type: DataType.STRING })
  declare password: string;

  @Column({ type: DataType.STRING })
  declare fullName?: string | null;

  @Column({ type: DataType.STRING })
  declare avatarPath?: string | null;

  @Column({ unique: true, type: DataType.STRING })
  declare phone?: string | null;

  @Column({ allowNull: false, type: DataType.INTEGER })
  declare kind: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  declare isSuperAdmin: boolean;

  @ForeignKey(() => Group)
  @Column({ type: DataType.BIGINT })
  declare groupId: number;

  @BelongsTo(() => Group)
  declare group: Group;
}
