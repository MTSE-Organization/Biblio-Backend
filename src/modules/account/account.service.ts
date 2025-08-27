import { Constant } from '@/constants/constant';
import { Account } from '@/models';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import bcrypt from 'node_modules/bcryptjs';
import { RegisterForm } from '../auth/form/register.form';
import { NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account) private readonly accountRepository: typeof Account,
  ) {}

  async findAll() {
    return await this.accountRepository.findAll();
  }

  async findByEmail(email: string): Promise<Account | null> {
    return await this.accountRepository.findOne({ where: { email } });
  }

  async createUser(data: RegisterForm): Promise<Account> {
    data.password = this.hashPassword(data.password);
    const account = {
      ...data,
      kind: Constant.ACCOUNT_KIND_USER,
      status: Constant.STATUS_PENDING,
    };
    return await this.accountRepository.create(account);
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  checkPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  async validateUser(email: string, password: string) {
    const account = await this.findByEmail(email);
    if (account && this.checkPassword(password, account.password)) {
      return { id: account.id, kind: account.kind };
    }
    throw new UnauthorizedException();
  }

  async activateUser(email: string) {
    const account = await this.findByEmail(email);
    if (!account) {
      throw new NotFoundException(
        'Account not found',
        ErrorCode.ACCOUNT_ERROR_NOT_FOUND,
      );
    }
    account.status = Constant.STATUS_ACTIVE;
    await account.save();
  }
}
