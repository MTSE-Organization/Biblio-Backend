import { StringDecorator, DateDecorator } from '@/common/decorators';
import { GenderDecorator } from '@/common/decorators/gender.decorator';

export class CreateContributorForm {
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
