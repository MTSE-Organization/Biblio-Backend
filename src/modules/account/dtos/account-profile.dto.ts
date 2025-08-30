import { GroupDto } from '@/modules/group/dtos';
import { Expose, Type } from 'class-transformer';

export class AccountProfileDto {
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
  @Type(() => GroupDto)
  group: GroupDto;
}
