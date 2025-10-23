import { Expose } from 'class-transformer';

export class AccountShortDto {
  @Expose()
  id: number;

  @Expose()
  fullName: string;

  @Expose()
  avatarPath: string;

  @Expose()
  kind: number;

  @Expose()
  isSuperAdmin: boolean;
}
