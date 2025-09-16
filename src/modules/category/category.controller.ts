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
import { CategoryService } from './category.service';
import { JwtAuthGuard, AuthorizationGuard } from '../auth/guards';
import {
  ApiListResponse,
  ApiResponse,
  ApiResponseNoData,
  PCode
} from '@/common/decorators';
import { MapperUtil } from '@/utils';
import { ResponseListDto } from '@/common/interfaces';
import {
  CreateCategoryForm,
  FilterCategoryForm,
  UpdateCategoryForm
} from './form';
import { CategoryAutoCompleteDto, CategoryDto } from './dtos';
import { UpdateOrderingForm } from '@/common/forms';
import { Constant } from '@/constants';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiResponseNoData({ objectName: 'category', type: 'create' })
  @PCode('CAT_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreateCategoryForm) {
    return await this.categoryService.create(form);
  }

  @ApiListResponse(CategoryDto, { objectName: 'category' })
  @Get('list')
  async list(@Query() form: FilterCategoryForm) {
    form.status = Constant.STATUS_ACTIVE;
    const { categories, count } = await this.categoryService.findAll(form);
    return {
      content: MapperUtil.toDtoList(categories, CategoryDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
  }

  @ApiListResponse(CategoryDto, { objectName: 'category' })
  @PCode('CAT_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/list')
  async adminList(@Query() form: FilterCategoryForm) {
    const { categories, count } = await this.categoryService.findAll(form);
    return {
      content: MapperUtil.toDtoList(categories, CategoryDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
  }

  @ApiResponse(CategoryDto, { objectName: 'category' })
  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    const category = await this.categoryService.findByIdAndStatus(
      id,
      Constant.STATUS_ACTIVE
    );
    return MapperUtil.toDto(category, CategoryDto);
  }

  @ApiResponse(CategoryDto, { objectName: 'category' })
  @PCode('CAT_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('private/get/:id')
  async adminGet(@Param('id') id: bigint) {
    const category = await this.categoryService.findById(id);
    return MapperUtil.toDto(category, CategoryDto);
  }

  @ApiResponseNoData({ objectName: 'category', type: 'update' })
  @PCode('CAT_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdateCategoryForm) {
    console.log(form);
    return await this.categoryService.update(form);
  }

  @ApiResponseNoData({ objectName: 'category', type: 'delete' })
  @PCode('CAT_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.categoryService.delete(id);
  }

  @ApiListResponse(CategoryAutoCompleteDto, { objectName: 'category' })
  @UseGuards(JwtAuthGuard)
  @Get('auto-complete')
  async autocomplete(@Query() form: FilterCategoryForm) {
    const { categories, count } = await this.categoryService.findAll(form);
    return {
      content: MapperUtil.toDtoList(categories, CategoryAutoCompleteDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size)
    };
  }

  @ApiResponseNoData({ objectName: 'category', type: 'update-ordering' })
  @PCode('CAT_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update-ordering')
  async updateOrdering(@Body() form: UpdateOrderingForm[]) {
    return await this.categoryService.updateOrdering(form);
  }
}
