import { GroupAutoCompleteDto } from '@/modules/group/dtos/group-auto-complete.dto';
import { Expose, Type } from 'class-transformer';

export class AccountAutoCompleteDto {
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
  @Type(() => GroupAutoCompleteDto)
  group: GroupAutoCompleteDto;

  @Expose()
  status: number;
}
