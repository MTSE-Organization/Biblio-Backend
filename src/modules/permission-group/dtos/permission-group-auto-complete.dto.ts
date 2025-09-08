import { Expose } from 'class-transformer';

export class PermissionGroupAutoCompleteDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
