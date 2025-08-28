import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtAuthGuard } from '../auth/guards';
import { UpdateProfileFForm } from './forms';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('list')
  async list() {
    return await this.accountService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any) {
    const { userId } = req.user;
    return await this.accountService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-profile')
  async updateProfile(@Req() req: any, @Body() form: UpdateProfileFForm) {
    const { userId } = req.user;
    return await this.accountService.updateProfile(userId, form);
  }
}
