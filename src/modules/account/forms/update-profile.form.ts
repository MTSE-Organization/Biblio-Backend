import { EmailDecorator, StringDecorator } from '@/common/decorators';

export class UpdateProfileForm {
  @EmailDecorator('email', true)
  email: string;

  @StringDecorator('fullName')
  fullName: string | null = null;

  @StringDecorator('avatarPath')
  avatarPath: string | null = null;

  @StringDecorator('phone')
  phone: string | null = null;
}
