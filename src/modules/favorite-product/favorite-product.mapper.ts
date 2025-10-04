import { FavoriteProduct } from '@/models/favorite-product.model';
import { FavoriteProductDto } from '@/modules/favorite-product/dto/favorite-product.dto';
import { MapperUtil } from '@/utils';

export class FavoriteProductMapper {
  static toDto(product: FavoriteProduct): FavoriteProductDto {
    const plain = (product as any).get?.({ plain: true }) ?? product;

    if (plain.product.images && plain.product.images.length > 0) {
      plain.product.image = plain.product.images[0];
    }

    return MapperUtil.toDto(plain, FavoriteProductDto);
  }

  static toDtoList(products: FavoriteProduct[]): FavoriteProductDto[] {
    return products.map((p) => this.toDto(p));
  }
}
