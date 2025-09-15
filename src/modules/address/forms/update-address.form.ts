import { CreateAddressForm } from './create-address.form';
import { BigIntDecorator } from '@/common/decorators';

export class UpdateAddressForm extends CreateAddressForm {
  @BigIntDecorator('id', true)
  id: bigint;
}
