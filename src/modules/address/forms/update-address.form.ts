import {
  BigIntDecorator,
  BooleanDecorator,
  NumberDecorator,
  StringDecorator
} from '@/common/decorators';

export class UpdateAddressForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('detail', true)
  detail: string;

  @StringDecorator('city', true)
  city: string;

  @StringDecorator('district')
  district: string;

  @StringDecorator('ward')
  ward: string;

  @StringDecorator('hamlet')
  hamlet: string;

  @NumberDecorator('longitude')
  longitude: number;

  @NumberDecorator('latitude')
  latitude: number;

  @BooleanDecorator('isDefault')
  isDefault?: boolean;
}
