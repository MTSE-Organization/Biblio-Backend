import { PermissionGroupAutoCompleteDto } from '@/modules/permission-group/dtos';
import { Expose, Type } from 'class-transformer';

export class PermissionDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  pCode: string;

  @Expose()
  @Type(() => PermissionGroupAutoCompleteDto)
  permissionGroup: PermissionGroupAutoCompleteDto;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
