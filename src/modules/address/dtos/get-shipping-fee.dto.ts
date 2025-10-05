import { Expose } from 'class-transformer';

export class GetShippingFeeDto {
  @Expose()
  shippingFee: number;

  constructor(shippingFee: number) {
    this.shippingFee = shippingFee;
  }
}
