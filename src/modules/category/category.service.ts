import { Category } from '@/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryForm } from './form/create-category.form';
import { BadRequestException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { CategoryMapper } from '@/common/mappers/category.mapper';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private readonly categoryRepository: typeof Category,
    private readonly categoryMapper: CategoryMapper,
  ) {}

  async create(form: CreateCategoryForm) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: form.name },
    });
    console.log(existingCategory);

    if (existingCategory) {
      throw new BadRequestException(
        'Category already exists',
        ErrorCode.CATEGORY_ERROR_NAME_EXISTED,
      );
    }
    const category = await this.categoryRepository.create({
      ...form,
      slug: form.name.toLowerCase().replace(/\s+/g, '-'),
    });
    return this.categoryMapper.toDto(category);
  }

  async findAll() {
    return this.categoryRepository.findAll();
  }

  async findById(id: number) {
    return this.categoryRepository.findByPk(id);
  }
}
