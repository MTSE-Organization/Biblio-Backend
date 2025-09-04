import { Expose } from 'class-transformer';

export class ProductAutoCompleteDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  pCode: string;
}
