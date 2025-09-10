import {
  BeforeCreate,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  UpdatedAt
} from 'sequelize-typescript';
import SnowflakeID from 'snowflake-id';

const snowflake = new SnowflakeID({
  mid: 1,
  offset: Date.UTC(2004, 8, 2)
});

export abstract class Auditable extends Model {
  @PrimaryKey
  @Column({ type: DataType.BIGINT })
  declare id: bigint;

  @CreatedAt
  @Column({ field: 'created_date' })
  declare createdDate: Date;

  @UpdatedAt
  @Column({ field: 'modified_date' })
  declare modifiedDate: Date;

  @Column({ defaultValue: 1 })
  declare status: number;

  @BeforeCreate
  static assignId(instance: Auditable) {
    instance.id = snowflake.generate();
  }
}
