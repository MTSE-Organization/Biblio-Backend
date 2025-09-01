import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../auth/guards';
import { FilterAccountForm, UpdateProfileFForm } from './forms';
import { AccountDto } from './dtos';
import { plainToInstance } from 'class-transformer';
import { ResponseListDto } from '@/common/interfaces';
import { MapperUtil } from '@/utils';
import { AccountProfileDto } from './dtos/account-profile.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('list')
  async list(@Query() form: FilterAccountForm) {
    const { accounts, count } = await this.accountService.list(form);
    const response: ResponseListDto<AccountDto[]> = {
      content: MapperUtil.toDtoList(accounts, AccountDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size),
    };
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any): Promise<AccountProfileDto> {
    const account = await this.accountService.findById(req.user.id);
    return plainToInstance(AccountProfileDto, account, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async updateProfile(@Req() req: any, @Body() form: UpdateProfileFForm) {
    const { id: userId } = req.user;
    return await this.accountService.updateProfile(userId, form);
  }
}
