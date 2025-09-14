import { Expose } from 'class-transformer';

export class ProductVariantAutoCompleteDto {
  @Expose()
  id: bigint;

  @Expose()
  condition: number;

  @Expose()
  format: number;

  @Expose()
  quantity: number;

  @Expose()
  modifiedPrice: number;

  @Expose()
  imageUrl: string;

  @Expose()
  productId: bigint;

  @Expose()
  status: number;
}
