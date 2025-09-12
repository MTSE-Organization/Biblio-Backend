import {
  StringDecorator,
  NumberDecorator,
  DateDecorator
} from '@/common/decorators';

export class CreateContributorForm {
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
