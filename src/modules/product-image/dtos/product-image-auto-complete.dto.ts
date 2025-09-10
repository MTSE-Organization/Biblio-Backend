import { Expose, Type } from 'class-transformer';

export class ProductImageAutoCompleteDto {
  @Expose()
  id: bigint;

  @Expose()
  url: string;
}
