import { Product } from '@/models/product.model';
import { ProductAutoCompleteDto, ProductDocDto, ProductDto } from './dtos';
import { MapperUtil } from '@/utils';

export class ProductMapper {
  static toAutoCompleteDto(product: Product): ProductAutoCompleteDto {
    const plain = (product as any).get?.({ plain: true }) ?? product;

    if (plain.images && plain.images.length > 0) {
      plain.image = plain.images[0];
    }

    return MapperUtil.toDto(plain, ProductAutoCompleteDto);
  }

  static toList(products: Product[]): ProductDto[] {
    return MapperUtil.toDtoList(products, ProductDto);
  }

  static toAutoCompleteDtoList(products: Product[]): ProductAutoCompleteDto[] {
    return products.map((p) => this.toAutoCompleteDto(p));
  }

  static toDocDto(product: Product): ProductDocDto {
    const plain = (product as any).get?.({ plain: true }) ?? product;
    plain.price = parseFloat(plain.price);

    plain.imageUrl =
      plain.images && plain.images.length > 0
        ? (plain.images[0].url ?? null)
        : null;

    return MapperUtil.toDto(plain, ProductDocDto);
  }
}
