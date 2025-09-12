import {
  BigIntDecorator,
  StringDecorator,
  NumberDecorator,
  DateDecorator
} from '@/common/decorators';
import { GenderDecorator } from '@/common/decorators/gender.decorator';

export class UpdateContributorForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('name', true)
  name: string;

  @StringDecorator('bio')
  bio: string;

  @StringDecorator('avatarPath')
  avatarPath: string;

  @GenderDecorator('gender', true)
  gender: number;

  @DateDecorator('dateOfBirth')
  dateOfBirth: Date;

  @StringDecorator('country')
  country: string;
}
