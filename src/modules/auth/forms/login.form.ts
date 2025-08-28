import { EmailDecorator, StringDecorator } from '@/common/decorators';

export class LoginForm {
  @EmailDecorator('email', true)
  email: string;

  @StringDecorator('password', true)
  password: string;
}
