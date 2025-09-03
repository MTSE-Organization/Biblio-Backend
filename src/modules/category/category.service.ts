import { Category } from '@/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { CreateCategoryForm } from './form/create-category.form';
import { UpdateCategoryForm } from './form/update-category.form';
import { FilterCategoryForm } from './form/filter-category.form';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryRepository: typeof Category,
  ) {}

  async create(form: CreateCategoryForm) {
    if (await this.existsBy('name', form.name)) {
      throw new BadRequestException(
        'Category name already exists',
        ErrorCode.CATEGORY_ERROR_NAME_EXISTED,
      );
    }

    if (await this.existsBy('slug', form.slug)) {
      throw new BadRequestException(
        'Category slug already exists',
        ErrorCode.CATEGORY_ERROR_SLUG_EXISTED,
      );
    }

    const category = await this.categoryRepository.create({
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description || '',
      ordering: form.ordering ?? 0,
      imageUrl: '',
    });

    return { message: 'Create category successfully', category };
  }

  async update(form: UpdateCategoryForm) {
    const { id, ...data } = form;
    const category = await this.findById(id);
    console.log(form);
    if (
      data.name &&
      data.name !== category.name &&
      (await this.existsBy('name', data.name))
    ) {
      throw new BadRequestException(
        'Category name already exists',
        ErrorCode.CATEGORY_ERROR_NAME_EXISTED,
      );
    }

    if (
      data.slug &&
      data.slug !== category.slug &&
      (await this.existsBy('slug', data.slug))
    ) {
      throw new BadRequestException(
        'Category slug already exists',
        ErrorCode.CATEGORY_ERROR_SLUG_EXISTED,
      );
    }

    if (data.name && !data.slug) {
      data.slug = data.name.toLowerCase().replace(/\s+/g, '-');
    }

    category.set(data);
    await category.save();

    return { message: 'Update category successfully', category };
  }

  async delete(id: bigint) {
    const category = await this.findById(id);
    await category.destroy();
    return { message: 'Delete category successfully' };
  }

  async findAll(
    query?: FilterCategoryForm,
  ): Promise<{ categories: Category[]; count: number }> {
    if (!query) {
      const categories = await this.categoryRepository.findAll();
      return { categories, count: categories.length };
    }

    const { page = 0, size = 10 } = query;
    const skip = page * size;

    const { rows, count } = await this.categoryRepository.findAndCountAll({
      limit: size,
      offset: skip,
      order: [['ordering', 'ASC']],
    });

    return { categories: rows, count };
  }

  async findById(id: bigint): Promise<Category> {
    const category = await this.categoryRepository.findByPk(id);
    if (!category) {
      throw new NotFoundException(
        'Category not found',
        ErrorCode.CATEGORY_ERROR_NOT_FOUND,
      );
    }
    return category;
  }

  async existsBy(field: keyof Category, value: any): Promise<boolean> {
    const count = await this.categoryRepository.count({
      where: { [field]: value },
    });
    return count > 0;
  }
}
