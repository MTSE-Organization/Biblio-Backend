import { Expose } from 'class-transformer';

export class ProductImageAutoCompleteDto {
  @Expose()
  id: bigint;

  @Expose()
  url: string;

  @Expose()
  ordering: number;

  @Expose()
  isDefault: boolean;
}
