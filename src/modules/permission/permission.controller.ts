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
import { PermissionService } from './permission.service';
import {
  CreatePermissionForm,
  FilterPermissionForm,
  UpdatePermissionForm
} from './forms';
import { MapperUtil } from '@/utils';
import { PermissionDto } from './dtos';
import { ResponseListDto } from '@/common/interfaces';
import { PCode } from '@/common/decorators';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @PCode('PER_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreatePermissionForm) {
    return await this.permissionService.create(form);
  }

  @PCode('PER_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('list')
  async list(@Query() form: FilterPermissionForm) {
    const { permissions, count } = await this.permissionService.findAll(form);
    const response: ResponseListDto<PermissionDto[]> = {
      content: MapperUtil.toDtoList(permissions, PermissionDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
    return response;
  }

  @PCode('PER_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    const permission = await this.permissionService.findById(id);
    return MapperUtil.toDto(permission, PermissionDto);
  }

  @PCode('PER_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdatePermissionForm) {
    return await this.permissionService.update(form);
  }

  @PCode('PER_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.permissionService.delete(id);
  }
}
