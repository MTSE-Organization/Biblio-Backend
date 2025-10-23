import { Expose } from 'class-transformer';

export class ReviewTopRatedProductDto {
  @Expose()
  productId: bigint;

  @Expose()
  productName: string;

  @Expose()
  starCount: number;
}
