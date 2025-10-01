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
import {
  CreateCategoryForm,
  FilterCategoryForm,
  UpdateCategoryForm
} from './form';
import { CategoryAutoCompleteDto, CategoryDto } from './dtos';
import { UpdateOrderingForm } from '@/common/forms';
import { Constant } from '@/constants';
import { RedisService } from '../redis/redis.service';
import { Category } from '@/models';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly redisService: RedisService
  ) {}

  @ApiResponseNoData({ objectName: 'category', type: 'create' })
  @PCode('CAT_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreateCategoryForm) {
    const result = await this.categoryService.create(form);
    await this.redisService.deleteByPrefix('category:list:');
    return result;
  }

  @ApiListResponse(CategoryDto, { objectName: 'category' })
  @Get('list')
  async list(@Query() form: FilterCategoryForm) {
    form.status = Constant.STATUS_ACTIVE;

    const cacheKey = `category:list:${JSON.stringify(form)}`;
    const cached = await this.redisService.get<{
      categories: Category[];
      count: number;
    }>(cacheKey);

    // cache hit
    if (cached) {
      await this.redisService.set(cacheKey, cached, 5 * 60 * 1000); // refresh TTL
      return {
        content: MapperUtil.toDtoList(cached.categories, CategoryDto),
        totalElements: cached.count,
        totalPages: Math.ceil(cached.count / form.size)
      };
    }

    // cache miss
    const { categories, count } = await this.categoryService.findAll(form);
    await this.redisService.set(
      cacheKey,
      { categories, count },
      5 * 60 * 1000 // 5 minutes
    );
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
    const result = await this.categoryService.update(form);
    await this.redisService.deleteByPrefix('category:list:');
    return result;
  }

  @ApiResponseNoData({ objectName: 'category', type: 'delete' })
  @PCode('CAT_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    const result = await this.categoryService.delete(id);
    await this.redisService.deleteByPrefix('category:list:');
    return result;
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
    const result = await this.categoryService.updateOrdering(form);
    await this.redisService.deleteByPrefix('category:list:');
    return result;
  }

  @ApiResponseNoData({
    message: 'Recover category successfully'
  })
  @PCode('CAT_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('recover/:id')
  async recover(@Param('id') id: bigint) {
    const result = await this.categoryService.recover(id);
    await this.redisService.deleteByPrefix('category:list:');
    return result;
  }
}
