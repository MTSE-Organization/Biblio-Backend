import { Expose } from 'class-transformer';

export class ContributorDto {
  @Expose()
  id: bigint;

  @Expose()
  name: string;

  @Expose()
  bio: string;

  @Expose()
  avatarPath: string;

  @Expose()
  kind: number;

  @Expose()
  gender: number;

  @Expose()
  dateOfBirth: Date;

  @Expose()
  country: string;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
