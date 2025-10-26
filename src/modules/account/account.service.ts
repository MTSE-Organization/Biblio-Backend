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
import {
  FilterAccountForm,
  UpdateEmployeeForm,
  UpdateProfileForm
} from './forms';
import { UserDetailsDto, UserInfoGoogleDto } from '../auth/dtos';
import * as bcrypt from 'bcryptjs';
import { GroupService } from '../group/group.service';
import { CartService } from '../cart/cart.service';
import { FileService } from '../file/file.service';
import { col, fn, Op } from 'sequelize';
import { FilterAccountStatisticForm } from './forms/filter-account-statistic.form';
import { CreateEmployeeForm } from './forms/create-employee.form';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account) private readonly accountRepository: typeof Account,
    private readonly groupService: GroupService,

    @Inject(forwardRef(() => CartService))
    private readonly cartService: CartService,

    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,

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

  async findByIdAndStatus(id: bigint, status: number): Promise<Account> {
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

  async findAllByKindIn(kinds: number[]): Promise<Account[]> {
    return await this.accountRepository.findAll({
      where: { kind: { [Op.in]: kinds } }
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

  async createEmployee(form: CreateEmployeeForm) {
    if (await this.existsBy('email', form.email)) {
      throw new BadRequestException(
        'Account error email existed',
        ErrorCode.ACCOUNT_ERROR_EMAIL_EXISTED
      );
    }
    const group = await this.groupService.findByIdAndKind(
      form.groupId,
      Constant.GROUP_KIND_EMPLOYEE
    );
    const password = this.hashPassword(form.password);
    const data = {
      ...form,
      kind: Constant.ACCOUNT_KIND_EMPLOYEE,
      password: password
    };
    const account = await this.accountRepository.create(data);
    await account.$set('group', group);
    return { message: 'Create employee account successfully' };
  }

  async updateEmployee(form: UpdateEmployeeForm) {
    const account = await this.findByIdAndStatus(
      form.id,
      Constant.STATUS_ACTIVE
    );
    if (form.email !== account.email) {
      const existingAccount = await this.findByEmail(form.email);
      if (existingAccount) {
        throw new BadRequestException(
          'Account error email existed',
          ErrorCode.ACCOUNT_ERROR_EMAIL_EXISTED
        );
      }
      account.email = form.email;
    }
    if (
      form.phone !== null &&
      (account.phone === null || form.phone !== account.phone)
    ) {
      if (await this.existsBy('phone', form.phone)) {
        throw new BadRequestException(
          'Account error phone existed',
          ErrorCode.ACCOUNT_ERROR_PHONE_EXISTED
        );
      }
      account.phone = form.phone;
    }
    if (account.avatarPath && form.avatarPath !== account.avatarPath) {
      await this.fileService.deleteFile(account.avatarPath);
    }
    if (form.password !== null) {
      const password = this.hashPassword(form.password);
      account.password = password;
    }
    account.fullName = form.fullName;
    account.avatarPath = form.avatarPath;
    await account.save();
    return { message: 'Update employee successfully' };
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

  async updateProfile(id: bigint, data: UpdateProfileForm) {
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

  async delete(id: bigint) {
    const account = await this.findById(id);
    if (account.avatarPath) {
      await this.fileService.deleteFile(account.avatarPath);
    }
    await this.notificationService.deleteAllByAccountId(id);
    await account.destroy();
    return { message: 'Delete account successfully' };
  }

  async existsBy(field: keyof Account, value: any): Promise<boolean> {
    const count = await this.accountRepository.count({
      where: { [field]: value }
    });
    return count > 0;
  }

  async countNewAccountsInDateRange(
    form: FilterAccountStatisticForm
  ): Promise<number> {
    const where: any = { kind: Constant.ACCOUNT_KIND_USER };

    if (form.fromDate && form.toDate && form.toDate < form.fromDate) {
      throw new BadRequestException(
        'toDate must be greater than or equal to fromDate'
      );
    }

    if (form.fromDate || form.toDate) {
      where.created_date = {};
      if (form.fromDate) where.created_date[Op.gte] = form.fromDate;
      if (form.toDate) where.created_date[Op.lte] = form.toDate;
    } else {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      where.created_date = {
        [Op.gte]: firstDay,
        [Op.lte]: lastDay
      };
    }

    return await this.accountRepository.count({ where });
  }

  async countNewAccountsByDay(form: FilterAccountStatisticForm) {
    const where: any = { kind: Constant.ACCOUNT_KIND_USER };

    if (form.fromDate && form.toDate && form.toDate < form.fromDate) {
      throw new BadRequestException('toDate must be >= fromDate');
    }

    if (!form.fromDate || !form.toDate) {
      const now = new Date();
      form.fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      form.toDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59
      );
    }

    where.created_date = {
      [Op.gte]: form.fromDate,
      [Op.lte]: form.toDate
    };

    const result = await this.accountRepository.findAll({
      attributes: [
        [fn('DATE', col('created_date')), 'date'],
        [fn('COUNT', col('id')), 'total']
      ],
      where,
      group: [fn('DATE', col('created_date'))],
      order: [[fn('DATE', col('created_date')), 'ASC']]
    });

    return {
      items: result.map((r: any) => ({
        date: r.getDataValue('date'),
        total: Number(r.getDataValue('total'))
      }))
    };
  }
}
