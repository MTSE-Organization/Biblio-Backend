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
import { UpdateProfileFForm } from './forms';
import { AccountDto } from './dtos';
import { plainToInstance } from 'class-transformer';
import { FilterAccountForm } from './forms/filter-account.form';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('list')
  async list(@Query() query: FilterAccountForm) {
    const res = await this.accountService.findAll(query);
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any): Promise<AccountDto> {
    const account = await this.accountService.findById(req.user.userId);
    return plainToInstance(AccountDto, account, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async updateProfile(@Req() req: any, @Body() form: UpdateProfileFForm) {
    const { userId } = req.user;
    return await this.accountService.updateProfile(userId, form);
  }
}
