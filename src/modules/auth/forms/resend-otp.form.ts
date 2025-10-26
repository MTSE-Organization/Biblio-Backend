import { EmailDecorator } from '@/common/decorators';

export class ResendOtpForm {
  @EmailDecorator('email', true)
  email: string;
}
