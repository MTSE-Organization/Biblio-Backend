import { EmailDecorator, StringDecorator } from '@/common/decorators';

export class ChangePasswordForm {
  @EmailDecorator('email', true)
  email: string;

  @StringDecorator('otp', true)
  otp: string;

  @StringDecorator('password', true)
  password: string;

  @StringDecorator('confirmPassword', true)
  confirmPassword: string;
}
