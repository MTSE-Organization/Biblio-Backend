import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { FilterAccountForm, UpdateProfileForm } from './forms';
import { AccountDto } from './dtos';
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
    return await this.accountService.delete(id, isSuperAdmin);
  }
}
