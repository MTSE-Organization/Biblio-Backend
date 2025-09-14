import { Expose } from 'class-transformer';

export class PermissionAutoCompleteDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  pCode: string;

  @Expose()
  status: number;
}
