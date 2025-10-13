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
  tableName: 'db_notification',
  timestamps: true
})
export class Notification extends Auditable {
  @Column({ type: DataType.STRING })
  declare title: string;

  @Column({ type: DataType.STRING })
  declare imageUrl: string;

  @Column({ type: DataType.TEXT })
  declare content: string;

  @ForeignKey(() => Account)
  @Column({ allowNull: false, type: DataType.BIGINT })
  declare accountId: bigint;

  @BelongsTo(() => Account)
  declare account: Account;

  @Column({ type: DataType.INTEGER })
  declare type: number;

  @Column({ type: DataType.TEXT })
  declare data: string; // {orderId, productId}

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  declare seen: boolean;

  @Column({ type: DataType.DATE })
  declare lastTimeRead: Date;
}
