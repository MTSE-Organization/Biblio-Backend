import { Expose } from 'class-transformer';

export class ProductImageDto {
  @Expose()
  id: bigint;

  @Expose()
  url: string;

  @Expose()
  ordering: number;

  @Expose()
  isDefault: boolean;

  @Expose()
  productId: bigint;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;
}
