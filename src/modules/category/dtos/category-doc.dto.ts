import { Expose } from 'class-transformer';

export class CategoryDocDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  status: number;
}
