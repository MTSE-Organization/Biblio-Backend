import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { RegisterForm } from './forms/register.form';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from '../otp/otp.service';
import { MailService } from '../mail/mail.service';
import { Constant } from '@/constants/constant';
import {
  ActiveAccountForm,
  ChangePasswordForm,
  ForgotPasswordForm,
} from './forms';
import { UserDetailsDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  async register(form: RegisterForm) {
    const account = await this.accountService.findByEmail(form.email);
    if (account) {
      throw new BadRequestException(
        'Account already exists',
        ErrorCode.ACCOUNT_ERROR_EMAIL_EXISTED,
      );
    }
    if (form.password !== form.confirmPassword) {
      throw new BadRequestException(
        'Password and Confirm Password do not match',
        ErrorCode.AUTH_ERROR_PASSWORD_MISMATCH,
      );
    }
    await this.accountService.createUser(form);

    // otp
    const otp = this.otpService.generateOtp();
    await this.otpService.storeOtp(form.email, otp);

    // send email
    void this.mailService.sendActivationMail(form.email, otp);

    return {
      message: 'Register successfully',
    };
  }

  async verifyOtp(form: ActiveAccountForm) {
    const isVerified = await this.otpService.verifyOtp(form.email, form.otp);
    if (!isVerified) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    // OTP valid - proceed to activate the user account or mark as verified
    await this.accountService.activateUser(form.email);
    return { message: 'OTP verified successfully' };
  }

  async login(user: UserDetailsDto) {
    const payload = { ...user };
    const token = await this.jwtService.signAsync(payload);
    return { message: 'Login successfully', token };
  }

  async forgotPassword(form: ForgotPasswordForm) {
    const account = await this.accountService.findByEmailAndStatus(
      form.email,
      Constant.STATUS_ACTIVE,
    );
    if (!account) {
      throw new NotFoundException(
        'Account not found',
        ErrorCode.ACCOUNT_ERROR_NOT_FOUND,
      );
    }

    // otp
    const otp = this.otpService.generateOtp();
    await this.otpService.storeOtp(form.email, otp);

    // send email
    void this.mailService.sendForgotPasswordMail(form.email, otp);

    return {
      message: 'Send OTP successfully',
    };
  }

  async changePassword(form: ChangePasswordForm) {
    const isVerified = await this.otpService.verifyOtp(form.email, form.otp);
    if (!isVerified) {
      throw new BadRequestException(
        'Invalid or expired OTP',
        ErrorCode.AUTH_ERROR_OTP_INVALID_OR_EXPIRED,
      );
    }
    if (form.password !== form.confirmPassword) {
      throw new BadRequestException(
        'Password and Confirm Password do not match',
        ErrorCode.AUTH_ERROR_PASSWORD_MISMATCH,
      );
    }
    await this.accountService.changePassword(form.email, form.password);
    return { message: 'Change password successfully' };
  }
}
