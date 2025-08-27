import { EmailDecorator, StringDecorator } from '@/common/decorators';

export class ActiveAccountForm {
  @EmailDecorator('email', true)
  email: string;

  @StringDecorator('otp', true)
  otp: string;
}
