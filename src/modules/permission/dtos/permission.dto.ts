import { Expose } from 'class-transformer';

export class AccountDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  pCode: string;

  @Expose()
  nameGroup: string;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
