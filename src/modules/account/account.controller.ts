import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import {
  CreateEmployeeForm,
  FilterAccountForm,
  UpdateEmployeeForm,
  UpdateProfileForm
} from './forms';
import { AccountDailyStatisticDto, AccountDto } from './dtos';
import { plainToInstance } from 'class-transformer';
import { ResponseListDto } from '@/common/interfaces';
import { MapperUtil } from '@/utils';
import { AccountProfileDto } from './dtos/account-profile.dto';
import { UserDetailsDto } from '../auth/dtos';
import {
  ApiListResponse,
  ApiResponse,
  ApiResponseNoData,
  PCode
} from '@/common/decorators';
import { AccountStatisticDto } from './dtos/account-statistic.dto';
import { FilterAccountStatisticForm } from './forms/filter-account-statistic.form';
import { Constant, ErrorCode } from '@/constants';
import { BadRequestException } from '@/common/exceptions';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiListResponse(AccountDto, { objectName: 'account' })
  @PCode('ACC_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('list')
  async list(@Query() form: FilterAccountForm) {
    const { accounts, count } = await this.accountService.list(form);
    const response: ResponseListDto<AccountDto[]> = {
      content: MapperUtil.toDtoList(accounts, AccountDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
    return response;
  }

  @ApiResponse(AccountDto)
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @PCode('ACC_V')
  @Get('get/:id')
  async get(@Param('id') id: bigint): Promise<AccountDto> {
    const account = await this.accountService.findById(id);
    return plainToInstance(AccountDto, account, {
      excludeExtraneousValues: true
    });
  }

  @ApiResponseNoData({ objectName: 'create-employee', type: 'create' })
  @PCode('ACC_C_EMP')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create-employee')
  async createEmployee(@Body() form: CreateEmployeeForm) {
    return await this.accountService.createEmployee(form);
  }

  @ApiResponseNoData({ objectName: 'update-employee', type: 'update' })
  @PCode('ACC_U_EMP')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('update-employee')
  async updateEmployee(@Body() form: UpdateEmployeeForm) {
    return await this.accountService.updateEmployee(form);
  }

  @ApiResponse(AccountProfileDto, { objectName: 'profile' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any): Promise<AccountProfileDto> {
    const account = await this.accountService.findById(req.user.id);
    return plainToInstance(AccountProfileDto, account, {
      excludeExtraneousValues: true
    });
  }

  @ApiResponseNoData({ objectName: 'profile', type: 'update' })
  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async updateProfile(@Req() req: any, @Body() form: UpdateProfileForm) {
    const { id: userId } = req.user;
    return await this.accountService.updateProfile(userId, form);
  }

  @ApiResponseNoData({ objectName: 'profile', type: 'delete' })
  @PCode('ACC_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint, @Req() req) {
    const user: UserDetailsDto = req.user;
    const isSuperAdmin = user.isSuperAdmin;

    if (user.kind === Constant.ACCOUNT_KIND_USER) {
      throw new BadRequestException(
        'Not allow to delete account user',
        ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_DELETE
      );
    }

    if (
      user.isSuperAdmin ||
      (isSuperAdmin === false && user.kind === Constant.ACCOUNT_KIND_ADMIN)
    ) {
      throw new BadRequestException(
        'Not allow to delete account',
        ErrorCode.ACCOUNT_ERROR_NOT_ALLOW_DELETE
      );
    }

    return await this.accountService.delete(id);
  }

  @ApiResponse(AccountStatisticDto, { objectName: 'account-statistic' })
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('statistics/new-customer')
  async getAccountStatistics(
    @Query() form: FilterAccountStatisticForm
  ): Promise<AccountStatisticDto> {
    const total = await this.accountService.countNewAccountsInDateRange(form);
    return {
      totalAccounts: total
    };
  }

  @ApiResponse(AccountDailyStatisticDto, {
    objectName: 'account daily statistic'
  })
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('statistics/daily')
  async getAccountDailyStatistics(
    @Query() form: FilterAccountStatisticForm
  ): Promise<AccountDailyStatisticDto> {
    const stats = await this.accountService.countNewAccountsByDay(form);
    return stats;
  }
}
