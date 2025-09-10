import { Column, DataType, Table } from 'sequelize-typescript';
import { Auditable } from './auditable.model';

@Table({
  tableName: 'db_contributor',
  timestamps: true,
})
export class Contributor extends Auditable {
  @Column({ allowNull: false, type: DataType.STRING })
  declare name: string;

  @Column({ type: DataType.TEXT })
  declare bio: string;

  @Column({ type: DataType.STRING })
  declare avatarPath: string;

  @Column({ allowNull: false, type: DataType.INTEGER })
  declare kind: number;

  @Column({ type: DataType.INTEGER })
  declare gender: number;

  @Column({ type: DataType.DATE })
  declare dateOfBirth: Date;

  @Column({ type: DataType.STRING })
  declare country: string;
}
