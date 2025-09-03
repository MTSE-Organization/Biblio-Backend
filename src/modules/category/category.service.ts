import { Category } from '@/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { CreateCategoryForm } from './form/create-category.form';
import { UpdateCategoryForm } from './form/update-category.form';
import { FilterCategoryForm } from './form/filter-category.form';
import slugify from 'slugify';
import { Op } from 'sequelize';
import { UpdateOrderingForm } from './form/update-ordering.form';

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

    const baseSlug = slugify(form.name, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await this.existsBy('slug', uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const maxOrderingCategory = await this.categoryRepository.findOne({
      order: [['ordering', 'DESC']],
    });
    const nextOrdering =
      maxOrderingCategory?.ordering != null
        ? maxOrderingCategory.ordering + 1
        : 0;

    const category = await this.categoryRepository.create({
      name: form.name,
      slug: uniqueSlug,
      description: form.description || '',
      ordering: nextOrdering,
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
      throw new BadRequestException('Category slug already exists');
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
    const { page = 0, size = 10, name } = query || {};
    const skip = page * size;

    const whereClause: any = {};

    if (name) {
      whereClause.name = { [Op.like]: `%${name}%` };
    }

    const { rows, count } = await this.categoryRepository.findAndCountAll({
      where: whereClause,
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

  async autocomplete(keyword: string): Promise<Category[]> {
    return await this.categoryRepository.findAll({
      where: {
        name: {
          [Op.iLike]: `%${keyword}%`,
        },
      },
      limit: 10,
      order: [['ordering', 'ASC']],
    });
  }

  async updateOrdering(
    forms: UpdateOrderingForm[],
  ): Promise<{ message: string }> {
    if (!forms || forms.length === 0) {
      throw new BadRequestException(
        'Input list cannot be empty',
        ErrorCode.CATEGORY_ERROR_INVALID_REQUEST,
      );
    }

    const ids = forms.map((f) => f.id);
    const categories = await this.categoryRepository.findAll({
      where: { id: ids },
    });

    if (categories.length !== ids.length) {
      throw new NotFoundException(
        'One or more categories not found',
        ErrorCode.CATEGORY_ERROR_NOT_FOUND,
      );
    }

    const orderingMap = new Map<number, number>();
    for (const form of forms) {
      orderingMap.set(Number(form.id), form.ordering);
    }

    for (const category of categories) {
      const newOrdering = orderingMap.get(Number(category.id));
      if (newOrdering !== undefined) {
        category.ordering = newOrdering;
        await category.save();
      }
    }

    return { message: 'Update ordering category success' };
  }
}
