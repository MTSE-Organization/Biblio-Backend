import { CategoryAutoCompleteDto } from '@/modules/category/dtos';
import { ContributorAutoCompleteDto } from '@/modules/contributor/dtos';
import {
  ProductImageAutoCompleteDto,
  ProductImageDto
} from '@/modules/product-image/dtos';
import { PublisherAutoCompleteDto } from '@/modules/publisher/dtos';
import { Expose, Type } from 'class-transformer';

export class ProductDto {
  @Expose()
  id: bigint;

  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  description: string;

  @Expose()
  price: string;

  @Expose()
  releaseDate: Date;

  @Expose()
  ageRating?: number;

  @Expose()
  language?: string;

  @Expose()
  isFeatured: boolean;

  @Expose()
  metaData?: string;

  @Expose()
  discount: number;

  @Expose()
  @Type(() => CategoryAutoCompleteDto)
  category: CategoryAutoCompleteDto;

  @Expose()
  @Type(() => ProductImageAutoCompleteDto)
  images?: ProductImageAutoCompleteDto[];

  @Expose()
  @Type(() => PublisherAutoCompleteDto)
  publisher: PublisherAutoCompleteDto;

  @Expose()
  @Type(() => ContributorAutoCompleteDto)
  contributors: ContributorAutoCompleteDto[];

  @Expose()
  totalViews: number;

  @Expose()
  createdDate: Date;

  @Expose()
  modifiedDate: Date;

  @Expose()
  status: number;
}
