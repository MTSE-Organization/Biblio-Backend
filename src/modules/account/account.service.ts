import { Account, Group, Permission } from '@/models';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RegisterForm } from '../auth/forms/register.form';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException
} from '@/common/exceptions';
import { Constant, ErrorCode } from '@/constants';
import { FilterAccountForm, UpdateProfileForm } from './forms';
import { UserDetailsDto, UserInfoGoogleDto } from '../auth/dtos';
import * as bcrypt from 'bcryptjs';
import { GroupService } from '../group/group.service';
import { CartService } from '../cart/cart.service';
import { FileService } from '../file/file.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account) private readonly accountRepository: typeof Account,
    private readonly groupService: GroupService,

    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,

    private readonly fileService: FileService
  ) {}

  async findById(id: bigint): Promise<Account> {
    const account: Account | null = await this.accountRepository.findByPk(id, {
      include: [
        {
          model: Group,
          include: [{ model: Permission, through: { attributes: [] } }]
        }
      ]
    });

    if (!account) {
      throw new NotFoundException(
        'Account not found',
        ErrorCode.ACCOUNT_ERROR_NOT_FOUND
      );
    }
    return account;
  }

  async findByIdAndStatus(id: number, status: number): Promise<Account> {
    const account: Account | null = await this.accountRepository.findOne({
      where: { id, status }
    });
    if (!account) {
      throw new NotFoundException(
        'Account not found',
        ErrorCode.ACCOUNT_ERROR_NOT_FOUND
      );
    }
    return account;
  }

  async list(
    query: FilterAccountForm
  ): Promise<{ accounts: Account[]; count: number }> {
    const { limit, offset } = query.getPagination();
    const filter = query.getFilter();

    const { rows, count } = await this.accountRepository.findAndCountAll({
      include: [Group],
      limit: limit,
      offset: offset,
      where: filter
    });

    return { accounts: rows, count };
  }

  async findByEmail(email: string): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { email },
      include: [
        {
          model: Group,
          include: [{ model: Permission, through: { attributes: [] } }]
        }
      ]
    });
  }

  async findByEmailAndStatus(
    email: string,
    status: number
  ): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { email, status },
      include: [
        {
          model: Group,
          include: [{ model: Permission, through: { attributes: [] } }]
        }
      ]
    });
  }

  async createUser(form: RegisterForm): Promise<Account> {
    form.password = this.hashPassword(form.password);
    const data = {
      ...form,
      kind: Constant.ACCOUNT_KIND_USER,
      status: Constant.STATUS_PENDING
    };
    const group = await this.groupService.findByName(Constant.GROUP_NAME_USER);
    const account = await this.accountRepository.create(data);
    await account.$set('group', group);
    return account;
  }

  async createUserSocial(userInfo: UserInfoGoogleDto): Promise<Account> {
    const data = {
      email: userInfo.email,
      fullName: userInfo.name,
      avatarPath: userInfo.picture,
      kind: Constant.ACCOUNT_KIND_USER
    };
    const group = await this.groupService.findByName(Constant.GROUP_NAME_USER);
    const account = await this.accountRepository.create(data);
    await account.$set('group', group);
    return account;
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  checkPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  async validateUser(email: string, password: string): Promise<UserDetailsDto> {
    const account = await this.findByEmailAndStatus(
      email,
      Constant.STATUS_ACTIVE
    );
    if (
      account &&
      account?.password &&
      this.checkPassword(password, account.password)
    ) {
      const authorities = account.group?.permissions?.map((p) => p.pCode) ?? [];
      const user = new UserDetailsDto(
        account.id,
        account.kind,
        authorities,
        account.isSuperAdmin
      );
      return user;
    }
    throw new UnauthorizedException(
      'Unauthorized',
      ErrorCode.AUTH_ERROR_UNAUTHORIZED
    );
  }

  async activateUser(email: string) {
    const account = await this.findByEmail(email);
    if (!account) {
      throw new NotFoundException(
        'Account not found',
        ErrorCode.ACCOUNT_ERROR_NOT_FOUND
      );
    }
    account.status = Constant.STATUS_ACTIVE;
    await account.save();
  }

  async changePassword(email: string, password: string) {
    const account = await this.findByEmailAndStatus(
      email,
      Constant.STATUS_ACTIVE
    );
    if (!account) {
      throw new NotFoundException(
        'Account not found',
        ErrorCode.ACCOUNT_ERROR_NOT_FOUND
      );
    }
    account.password = this.hashPassword(password);
    await account.save();
  }

  async updateProfile(id: number, data: UpdateProfileForm) {
    const account = await this.findByIdAndStatus(id, Constant.STATUS_ACTIVE);
    if (data.email !== account.email) {
      const existingAccount = await this.findByEmail(data.email);
      if (existingAccount) {
        throw new BadRequestException(
          'Account error email existed',
          ErrorCode.ACCOUNT_ERROR_EMAIL_EXISTED
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
          ErrorCode.ACCOUNT_ERROR_PHONE_EXISTED
        );
      }
      account.phone = data.phone;
    }
    if (account.avatarPath && data.avatarPath !== account.avatarPath) {
      await this.fileService.deleteFile(account.avatarPath);
    }
    account.fullName = data.fullName;
    account.avatarPath = data.avatarPath;
    await account.save();
    return { message: 'Profile updated successfully' };
  }

  async delete(id: bigint, isSuperAdmin: boolean) {
    const account = await this.findById(id);
    if (
      account.isSuperAdmin ||
      (isSuperAdmin === false && account.kind === Constant.ACCOUNT_KIND_ADMIN)
    ) {
      throw new BadRequestException(
        'Not allow to delete account',
        ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_DELETE
      );
    }
    if (account.avatarPath) {
      await this.fileService.deleteFile(account.avatarPath);
    }
    await account.destroy();
    return { message: 'Delete account successfully' };
  }

  async existsBy(field: keyof Account, value: any): Promise<boolean> {
    const count = await this.accountRepository.count({
      where: { [field]: value }
    });
    return count > 0;
  }
}
