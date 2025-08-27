import { Constant } from '@/constants/constant';
import { Account } from '@/models';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import bcrypt from 'node_modules/bcryptjs';
import { RegisterForm } from '../auth/forms/register.form';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { UpdateProfileFForm } from './forms';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account) private readonly accountRepository: typeof Account,
  ) {}

  async findById(id: number): Promise<Account> {
    const account: Account | null = await this.accountRepository.findByPk(id);
    console.log({ id, account });

    if (!account) {
      throw new NotFoundException(
        'Account not found',
        ErrorCode.ACCOUNT_ERROR_NOT_FOUND,
      );
    }
    return account;
  }

  async findByIdAndStatus(id: number, status: number): Promise<Account> {
    const account: Account | null = await this.accountRepository.findOne({
      where: { id, status },
    });
    if (!account) {
      throw new NotFoundException(
        'Account not found',
        ErrorCode.ACCOUNT_ERROR_NOT_FOUND,
      );
    }
    return account;
  }

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.findAll();
  }

  async findByEmail(email: string): Promise<Account | null> {
    return await this.accountRepository.findOne({ where: { email } });
  }

  async findByEmailAndStatus(
    email: string,
    status: number,
  ): Promise<Account | null> {
    return await this.accountRepository.findOne({ where: { email, status } });
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
    const account = await this.findByEmailAndStatus(
      email,
      Constant.STATUS_ACTIVE,
    );
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

  async changePassword(email: string, password: string) {
    const account = await this.findByEmailAndStatus(
      email,
      Constant.STATUS_ACTIVE,
    );
    if (!account) {
      throw new NotFoundException(
        'Account not found',
        ErrorCode.ACCOUNT_ERROR_NOT_FOUND,
      );
    }
    account.password = this.hashPassword(password);
    await account.save();
  }

  async updateProfile(id: number, data: UpdateProfileFForm) {
    const account = await this.findByIdAndStatus(id, Constant.STATUS_ACTIVE);
    if (data.email !== account.email) {
      const existingAccount = await this.findByEmail(data.email);
      if (existingAccount) {
        throw new BadRequestException(
          'Account error email existed',
          ErrorCode.ACCOUNT_ERROR_EMAIL_EXISTED,
        );
      }
      account.email = data.email;
    }
    if (
      data.phone !== null &&
      (account.phone === null || data.phone !== account.phone)
    ) {
      if (await this.existsBy('phone', data.phone)) {
        throw new BadRequestException(
          'Account error phone existed',
          ErrorCode.ACCOUNT_ERROR_PHONE_EXISTED,
        );
      }
      account.phone = data.phone;
    }
    account.fullName = data.fullName;
    account.avatarPath = data.avatarPath;
    await account.save();
    return { message: 'Profile updated successfully' };
  }

  async existsBy(field: keyof Account, value: any): Promise<boolean> {
    const count = await this.accountRepository.count({
      where: { [field]: value },
    });
    return count > 0;
  }
}
