import {
  StringDecorator,
  NumberDecorator,
  BooleanDecorator
} from '@/common/decorators';

export class CreateAddressForm {
  @StringDecorator('detail', true)
  detail: string;

  @StringDecorator('city', true)
  city: string;

  @StringDecorator('district', true)
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

  @StringDecorator('receiverName')
  receiverName: string;

  @StringDecorator('phoneNumber')
  phoneNumber: string;
}
