import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionForm } from './forms';
import { FilterPermissionForm } from './forms/filter-permission.form';
import { MapperUtil } from '@/utils';
import { PermissionDto } from './dtos';
import { ResponseListDto } from '@/common/interfaces';
import { UpdatePermissionForm } from './forms/update-permission.form';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  async create(@Body() form: CreatePermissionForm) {
    return await this.permissionService.create(form);
  }

  @Get('list')
  async list(@Query() form: FilterPermissionForm) {
    const { permissions, count } = await this.permissionService.findAll(form);
    const response: ResponseListDto<PermissionDto[]> = {
      content: MapperUtil.toDtoList(permissions, PermissionDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size),
    };
    return response;
  }

  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    const permission = await this.permissionService.findById(id);
    return MapperUtil.toDto(permission, PermissionDto);
  }

  @Put('update')
  async update(@Body() form: UpdatePermissionForm) {
    return await this.permissionService.update(form);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.permissionService.delete(id);
  }
}
