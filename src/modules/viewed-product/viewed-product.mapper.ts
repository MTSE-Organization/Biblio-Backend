import { ViewedProduct } from '@/models/viewed-product.model';
import { ViewedProductDto } from '@/modules/viewed-product/dtos/viewed-product.dto';
import { MapperUtil } from '@/utils';

export class ViewProductMapper {
  static toDto(product: ViewedProduct): ViewedProductDto {
    const plain = (product as any).get?.({ plain: true }) ?? product;

    if (plain.product.images && plain.product.images.length > 0) {
      plain.product.image = plain.product.images[0];
    }

    return MapperUtil.toDto(plain, ViewedProductDto);
  }

  static toDtoList(products: ViewedProduct[]): ViewedProductDto[] {
    return products.map((p) => this.toDto(p));
  }
}
