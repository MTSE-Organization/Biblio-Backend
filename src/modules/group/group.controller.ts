import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupForm, FilterGroupForm, UpdateGroupForm } from './forms';
import { GroupDto } from './dtos';
import { MapperUtil } from '@/utils';
import { GroupAutoCompleteDto } from './dtos/group-auto-complete.dto';
import { ResponseListDto } from '@/common/interfaces';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { PCode } from '@/common/decorators';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @PCode('GR_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  create(@Body() form: CreateGroupForm) {
    return this.groupService.create(form);
  }

  @PCode('GR_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('list')
  async list(@Query() form: FilterGroupForm) {
    const { groups, count } = await this.groupService.list(form);
    const response: ResponseListDto<GroupAutoCompleteDto[]> = {
      content: MapperUtil.toDtoList(groups, GroupAutoCompleteDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
    return response;
  }

  @PCode('GR_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    const group = await this.groupService.findById(id);
    return MapperUtil.toDto(group, GroupDto);
  }

  @PCode('GR_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  update(@Body() form: UpdateGroupForm) {
    return this.groupService.update(form);
  }

  @PCode('GR_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.groupService.deleteById(id);
  }
}
