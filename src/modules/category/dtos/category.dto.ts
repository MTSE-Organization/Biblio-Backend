import { Expose } from 'class-transformer';

export class CategoryDto {
  @Expose()
  id: bigint;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  imageUrl: string;

  @Expose()
  ordering: number;

  @Expose()
  status: number;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;
}
