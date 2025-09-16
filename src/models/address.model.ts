import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table
} from 'sequelize-typescript';
import { Auditable } from './auditable.model';
import { Account } from './account.model';

@Table({
  tableName: 'db_address',
  timestamps: true
})
export class Address extends Auditable {
  @Column({ type: DataType.STRING })
  declare detail: string;

  @Column({ type: DataType.STRING })
  declare city: string;

  @Column({ type: DataType.STRING })
  declare district: string;

  @Column({ type: DataType.STRING })
  declare ward: string;

  @Column({ type: DataType.STRING })
  declare hamlet: string;

  @Column({ type: DataType.FLOAT })
  declare longitude: number;

  @Column({ type: DataType.FLOAT })
  declare latitude: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare isDefault: boolean;

  @ForeignKey(() => Account)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare accountId: bigint;

  @BelongsTo(() => Account)
  declare account: Account;
}
