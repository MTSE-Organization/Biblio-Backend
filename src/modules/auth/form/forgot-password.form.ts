import { EmailDecorator } from '@/common/decorators';

export class ForgotPasswordForm {
  @EmailDecorator('email', true)
  email: string;
}
