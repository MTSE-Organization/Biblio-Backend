import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendActivationMail(email: string, otp: string): Promise<void> {
    return this.mailerService
      .sendMail({
        to: email,
        subject: 'Activate account',
        text: 'Welcome to Biblio',
        template: 'register',
        context: {
          name: 'Test',
          otp: otp
        }
      })
      .then((info) => console.log('Mail sent:', info))
      .catch((err) => console.error('Mail error:', err));
  }

  async sendForgotPasswordMail(email: string, otp: string): Promise<void> {
    return this.mailerService
      .sendMail({
        to: email,
        subject: 'Forgot Password',
        text: 'Welcome to Biblio',
        template: 'forgot-password',
        context: {
          name: 'Test',
          otp: otp
        }
      })
      .then((info) => console.log('Mail sent:', info))
      .catch((err) => console.error('Mail error:', err));
  }
}
