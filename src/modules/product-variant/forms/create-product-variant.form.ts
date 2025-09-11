import {
  BigIntDecorator,
  NumberDecorator,
  ProductVariantConditionDecorator,
  ProductVariantFormatDecorator,
  StringDecorator
} from '@/common/decorators';

export class CreateProductVariantForm {
  @ProductVariantConditionDecorator('condition', true)
  condition: number;

  @ProductVariantFormatDecorator('format', true)
  format: number;

  @NumberDecorator('quantity')
  quantity: number;

  @NumberDecorator('modifiedPrice')
  modifiedPrice: number;

  @StringDecorator('imageUrl')
  imageUrl: string;

  @BigIntDecorator('productId', true)
  productId: bigint;
}
