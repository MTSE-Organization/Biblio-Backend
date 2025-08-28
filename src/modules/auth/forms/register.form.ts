import { EmailDecorator, StringDecorator } from '@/common/decorators';

export class RegisterForm {
  @EmailDecorator('email', true)
  email: string;

  @StringDecorator('password', true)
  password: string;

  @StringDecorator('confirmPassword', true)
  confirmPassword: string;
}
