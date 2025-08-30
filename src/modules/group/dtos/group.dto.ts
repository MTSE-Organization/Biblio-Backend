import { PermissionAutoCompleteDto } from '@/modules/permission/dtos';
import { Expose, Type } from 'class-transformer';

export class GroupDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  kind: number;

  @Expose()
  isSystemRole: boolean;

  @Expose()
  @Type(() => PermissionAutoCompleteDto)
  permissions: PermissionAutoCompleteDto[];

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
