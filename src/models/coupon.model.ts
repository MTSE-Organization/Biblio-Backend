import { Column, DataType, Table } from 'sequelize-typescript';
import { Auditable } from './auditable.model';

@Table({
  tableName: 'db_coupon',
  timestamps: true
})
export class Coupon extends Auditable {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  declare code: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare kind: number; // 1: discount, 2: freeship

  @Column({ type: DataType.STRING })
  declare name: string;

  @Column({ type: DataType.TEXT })
  declare description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare type: number; // 1: fixed, 2: percentage

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  declare value: string;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  declare minOrderAmount: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare quantity: number;

  @Column({ type: DataType.DATE })
  declare validFrom: Date;

  @Column({ type: DataType.DATE })
  declare validTo: Date;
}
