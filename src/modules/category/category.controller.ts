import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryForm } from './form/create-category.form';
import { AuthorizationGuard, JwtAuthGuard } from '../auth/guards';
import { Role } from '@/common/decorators';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Role('CAT_C')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Post('create')
  async create(@Body() form: CreateCategoryForm) {
    return await this.categoryService.create(form);
  }

  @Role('CAT_L')
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Get('list')
  async list() {
    return await this.categoryService.findAll();
  }

  @Get('get/:id')
  async get(@Param('id') id: number) {
    return await this.categoryService.findById(id);
  }
}
