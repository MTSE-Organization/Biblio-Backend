import { Expose } from 'class-transformer';

export class CategoryAutoCompleteDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  slug: string;
}
