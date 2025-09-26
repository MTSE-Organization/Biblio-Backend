import { AccountDto } from '@/modules/account/dtos';
import { ProductVariantDto } from '@/modules/product-variant/dtos';
import { ProductDto } from '@/modules/product/dtos';
import { Expose, Type } from 'class-transformer';

export class FavoriteProductDto {
  @Expose()
  id: bigint;

  @Expose()
  @Type(() => ProductDto)
  product: ProductDto;

  @Expose()
  @Type(() => ProductVariantDto)
  productVariant: ProductVariantDto;

  @Expose()
  @Type(() => AccountDto)
  account: AccountDto;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
