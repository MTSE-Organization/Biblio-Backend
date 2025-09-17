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
import {
  ApiListResponse,
  ApiResponse,
  ApiResponseNoData,
  PCode
} from '@/common/decorators';

@Controller('permission-group')
export class PermissionGroupController {
  constructor(
    private readonly permissionGroupService: PermissionGroupService
  ) {}

  @ApiResponseNoData({
    objectName: 'permission group',
    type: 'create'
  })
  @PCode('PER_GR_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreatePermissionGroupForm) {
    return await this.permissionGroupService.create(form);
  }

  @ApiListResponse(PermissionGroupAutoCompleteDto, {
    objectName: 'permission group'
  })
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

  @ApiResponse(PermissionGroupDto, { objectName: 'permission group' })
  @PCode('PER_GR_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    const permissionGroup = await this.permissionGroupService.findById(id);
    return MapperUtil.toDto(permissionGroup, PermissionGroupDto);
  }

  @ApiResponseNoData({
    objectName: 'group',
    type: 'update'
  })
  @PCode('PER_GR_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdatePermissionGroupForm) {
    return await this.permissionGroupService.update(form);
  }

  @ApiResponseNoData({
    objectName: 'group',
    type: 'delete'
  })
  @PCode('PER_GR_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.permissionGroupService.delete(id);
  }
}
