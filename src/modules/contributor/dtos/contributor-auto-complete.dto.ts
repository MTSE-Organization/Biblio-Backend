import { Expose } from 'class-transformer';

export class ContributorAutoCompleteDto {
  @Expose()
  id: bigint;

  @Expose()
  name: string;

  @Expose()
  avatarPath: string;

  @Expose()
  kind: number;
}
