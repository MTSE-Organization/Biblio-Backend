import { Expose } from 'class-transformer';

export class PermissionGroupDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
