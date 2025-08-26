import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { RegisterForm } from './form/register.form';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { LoginForm } from './form/login.form';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
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
    return { message: 'Register successfully' };
  }

  async login({ id, kind }) {
    const token = await this.jwtService.signAsync({ id, kind });
    return { message: 'Login successfully', token };
  }
}
