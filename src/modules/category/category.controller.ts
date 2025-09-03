import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryForm } from './form/create-category.form';
import { UpdateCategoryForm } from './form/update-category.form';
import { FilterCategoryForm } from './form/filter-category.form';
import { JwtAuthGuard, AuthorizationGuard } from '../auth/guards';
import { PCode } from '@/common/decorators';
import { CategoryDto } from './dtos/category.dto';
import { MapperUtil } from '@/utils';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // @PCode('CAT_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreateCategoryForm) {
    return await this.categoryService.create(form);
  }

  // @PCode('CAT_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('list')
  async list(@Query() form: FilterCategoryForm) {
    const { categories, count } = await this.categoryService.findAll(form);
    return {
      content: MapperUtil.toDtoList(categories, CategoryDto),
      totalElements: count,
      totalPages: Math.ceil(count / form.size),
    };
  }

  // @PCode('CAT_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    const category = await this.categoryService.findById(id);
    return MapperUtil.toDto(category, CategoryDto);
  }

  // @PCode('CAT_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdateCategoryForm) {
    console.log(form);
    return await this.categoryService.update(form);
  }

  // @PCode('CAT_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.categoryService.delete(id);
  }
}
