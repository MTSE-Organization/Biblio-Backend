import { Expose } from 'class-transformer';

export class AccountDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  fullName: string;

  @Expose()
  avatarPath: string;

  @Expose()
  phone: string;

  @Expose()
  kind: number;

  @Expose()
  isSuperAdmin: boolean;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
