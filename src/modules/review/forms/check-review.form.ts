import { BigIntDecorator } from '@/common/decorators';
import { Type } from 'class-transformer';

export class CheckReviewForm {
  @BigIntDecorator('orderId', true)
  @Type(() => Number)
  orderId: bigint;

  @BigIntDecorator('productId', true)
  @Type(() => Number)
  productId: bigint;

  @BigIntDecorator('productVariantId', true)
  @Type(() => Number)
  productVariantId: bigint;
}
