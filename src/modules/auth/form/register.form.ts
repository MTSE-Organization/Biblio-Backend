import { StringDecorator } from '@/common/decorators';

export class RegisterForm {
  @StringDecorator('email', true)
  email: string;

  @StringDecorator('password', true)
  password: string;
}
