import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { RegisterForm } from './form/register.form';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '../otp/otp.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly mailerService: MailerService,
  ) {}

  async register(form: RegisterForm) {
    const account = await this.accountService.findByEmail(form.email);
    if (account) {
      throw new BadRequestException(
        'Account already exists',
        ErrorCode.ACCOUNT_ERROR_EMAIL_EXISTED,
      );
    }
    await this.accountService.createUser(form);

    // otp
    const otp = this.otpService.generateOtp();
    await this.otpService.storeOtp(form.email, otp);

    // send email
    await this.mailerService
      .sendMail({
        to: form.email,
        subject: 'Activate account',
        text: 'Welcome to Biblio',
        template: 'register',
        context: {
          name: 'Test',
          otp: otp,
        },
      })
      .then((info) => console.log('Mail sent:', info))
      .catch((err) => console.error('Mail error:', err));

    return {
      message: 'Register successfully',
    };
  }

  async verifyOtp(email: string, otp: string) {
    const isVerified = await this.otpService.verifyOtp(email, otp);
    if (!isVerified) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    // OTP valid - proceed to activate the user account or mark as verified
    await this.accountService.activateUser(email);
    return { message: 'OTP verified successfully' };
  }

  async login({ id, kind }) {
    const token = await this.jwtService.signAsync({ id, kind });
    return { message: 'Login successfully', token };
  }
}
