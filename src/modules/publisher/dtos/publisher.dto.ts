import { Expose } from 'class-transformer';

export class PublisherDto {
  @Expose()
  id: bigint;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  logoPath: string;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
