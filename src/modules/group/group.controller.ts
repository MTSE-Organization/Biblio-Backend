import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupForm, FilterGroupForm, UpdateGroupForm } from './forms';
import { GroupDto } from './dtos';
import { MapperUtil } from '@/utils';
import { GroupAutoCompleteDto } from './dtos/group-auto-complete.dto';
import { ResponseListDto } from '@/common/interfaces';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('create')
  create(@Body() form: CreateGroupForm) {
    return this.groupService.create(form);
  }

  @Get('list')
  async list(@Query() form: FilterGroupForm) {
    const { groups, count } = await this.groupService.list(form);
    const response: ResponseListDto<GroupAutoCompleteDto[]> = {
      content: MapperUtil.toDtoList(groups, GroupAutoCompleteDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size),
    };
    return response;
  }

  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    const group = await this.groupService.findById(id);
    return MapperUtil.toDto(group, GroupDto);
  }

  @Put('update')
  update(@Body() form: UpdateGroupForm) {
    return this.groupService.update(form);
  }

  @Get('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.groupService.deleteById(id);
  }
}
