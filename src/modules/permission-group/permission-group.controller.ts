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
import { PermissionGroupService } from './permission-group.service';
import {
  CreatePermissionGroupForm,
  FilterPermissionGroupForm,
  UpdatePermissionGroupForm
} from './forms';
import { PermissionGroupAutoCompleteDto, PermissionGroupDto } from './dtos';
import { MapperUtil } from '@/utils';
import { ResponseListDto } from '@/common/interfaces';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { PCode } from '@/common/decorators';

@Controller('permission-group')
export class PermissionGroupController {
  constructor(
    private readonly permissionGroupService: PermissionGroupService
  ) {}

  @PCode('PER_GR_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreatePermissionGroupForm) {
    return await this.permissionGroupService.create(form);
  }

  @PCode('PER_GR_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('list')
  async list(@Query() form: FilterPermissionGroupForm) {
    const { permissionGroups, count } =
      await this.permissionGroupService.findAll(form);
    const response: ResponseListDto<PermissionGroupAutoCompleteDto[]> = {
      content: MapperUtil.toDtoList(
        permissionGroups,
        PermissionGroupAutoCompleteDto
      ),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
    return response;
  }

  @PCode('PER_GR_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    const permissionGroup = await this.permissionGroupService.findById(id);
    return MapperUtil.toDto(permissionGroup, PermissionGroupDto);
  }

  @PCode('PER_GR_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdatePermissionGroupForm) {
    return await this.permissionGroupService.update(form);
  }

  @PCode('PER_GR_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.permissionGroupService.delete(id);
  }
}
