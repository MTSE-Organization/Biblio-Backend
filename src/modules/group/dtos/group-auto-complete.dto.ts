import { Expose } from 'class-transformer';

export class GroupAutoCompleteDto {
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
  status: number;
}
