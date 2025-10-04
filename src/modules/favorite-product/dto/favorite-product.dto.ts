import { AccountDto } from '@/modules/account/dtos';
import { ProductAutoCompleteDto, ProductDto } from '@/modules/product/dtos';
import { Expose, Type } from 'class-transformer';

export class FavoriteProductDto {
  @Expose()
  id: bigint;

  @Expose()
  @Type(() => ProductAutoCompleteDto)
  product: ProductAutoCompleteDto;

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
