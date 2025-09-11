import {
  BigIntDecorator,
  NumberDecorator,
  ProductVariantConditionDecorator,
  ProductVariantFormatDecorator,
  StringDecorator
} from '@/common/decorators';

export class UpdateProductVariantForm {
  @BigIntDecorator('id', true)
  id: bigint;

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
}
