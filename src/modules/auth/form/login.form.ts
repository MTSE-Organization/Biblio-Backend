import { StringDecorator } from '@/common/decorators';

export class LoginForm {
  @StringDecorator('email', true)
  email: string;
  
  @StringDecorator('password', true)
  password: string;
}
