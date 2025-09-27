import { Expose } from 'class-transformer';

export class PublisherAutoCompleteDto {
  @Expose()
  id: bigint;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  logoPath?: string;

  @Expose()
  status: number;
}
