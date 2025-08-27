import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { RegisterForm } from './form/register.form';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
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
    return {
      data: { email: form.email, otp: otp },
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
