import { GroupAutoCompleteDto } from '@/modules/group/dtos/group-auto-complete.dto';
import { Expose, Type } from 'class-transformer';

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
