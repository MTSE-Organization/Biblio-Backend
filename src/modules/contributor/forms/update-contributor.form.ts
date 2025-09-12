import {
  BigIntDecorator,
  StringDecorator,
  NumberDecorator,
  DateDecorator
} from '@/common/decorators';

export class UpdateContributorForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('name', true)
  name: string;

  @StringDecorator('bio')
  bio: string;

  @StringDecorator('avatarPath')
  avatarPath: string;

  @NumberDecorator('kind', true)
  kind: number;

  @NumberDecorator('gender')
  gender: number;

  @DateDecorator('dateOfBirth')
  dateOfBirth: Date;

  @StringDecorator('country')
  country: string;
}
