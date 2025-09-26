import { Auditable } from '@/models/auditable.model';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'db_viewed_product',
  timestamps: true
})
export class ViewedProduct extends Auditable {}
