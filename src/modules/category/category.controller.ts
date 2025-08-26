import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryForm } from './form/create-category.form';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async create(@Body() form: CreateCategoryForm) {
    return await this.categoryService.create(form);
  }

  @Get('list')
  async list() {
    return await this.categoryService.findAll();
  }

  @Get('get/:id')
  async get(@Param('id') id: number) {
    return await this.categoryService.findById(id);
  }
}
