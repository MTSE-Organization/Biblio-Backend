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
import { UpdateOrderingForm } from './form/update-ordering.form';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // @PCode('CAT_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreateCategoryForm) {
    return await this.categoryService.create(form);
  }

  @PCode('CAT_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('list')
  async list(@Query() form: FilterCategoryForm) {
    const { categories, count } = await this.categoryService.findAll(form);
    return {
      content: MapperUtil.toDtoList(categories, CategoryDto),
      totalElements: count,
      totalPages: Math.ceil(count / (form.size || 10)),
    };
  }

  @PCode('CAT_V')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('get/:id')
  async get(@Param('id') id: bigint) {
    const category = await this.categoryService.findById(id);
    return MapperUtil.toDto(category, CategoryDto);
  }

  @PCode('CAT_U')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update')
  async update(@Body() form: UpdateCategoryForm) {
    console.log(form);
    return await this.categoryService.update(form);
  }

  @PCode('CAT_D')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: bigint) {
    return await this.categoryService.delete(id);
  }
  @PCode('CAT_AUTO')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('autocomplete')
  async autocomplete(@Query('q') keyword: string) {
    const categories = await this.categoryService.autocomplete(keyword);
    return MapperUtil.toDtoList(categories, CategoryDto);
  }

  @PCode('CAT_U_ORDER')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Put('update-ordering')
  async updateOrdering(@Body() form: UpdateOrderingForm[]) {
    return await this.categoryService.updateOrdering(form);
  }
}
