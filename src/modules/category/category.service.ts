import { Category } from '@/models';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import slugify from 'slugify';
import { Op } from 'sequelize';
import { ProductService } from '../product/product.service';
import {
  CreateCategoryForm,
  FilterCategoryForm,
  UpdateCategoryForm,
} from './form';
import { UpdateOrderingForm } from '@/common/forms';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryRepository: typeof Category,
    private readonly productService: ProductService,
  ) {}

  async create(form: CreateCategoryForm) {
    if (await this.existsBy('name', form.name)) {
      throw new BadRequestException(
        'Category name already exists',
        ErrorCode.CATEGORY_ERROR_NAME_EXISTED,
      );
    }

    const slug = slugify(form.name, { lower: true, strict: true });

    const maxOrderingCategory = await this.categoryRepository.findOne({
      order: [['ordering', 'DESC']],
    });

    const nextOrdering =
      maxOrderingCategory?.ordering != null
        ? maxOrderingCategory.ordering + 1
        : 0;

    const category = await this.categoryRepository.create({
      name: form.name,
      slug,
      description: form.description || '',
      ordering: nextOrdering,
      imageUrl: form.imageUrl,
    });

    return { message: 'Create category successfully', category };
  }

  async update(form: UpdateCategoryForm) {
    const { id, ...data } = form;
    const category = await this.findById(id);

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

    if (data.name && data.name !== category.name) {
      category.slug = slugify(data.name, { lower: true, strict: true });
    }

    category.set(data);

    await category.save();

    return { message: 'Update category successfully', category };
  }

  async delete(id: bigint) {
    const category = await this.findById(id);

    const hasProducts = await this.productService.existsBy('categoryId', id);
    if (hasProducts) {
      throw new BadRequestException(
        'Cannot delete category because it is in use by one or more products',
        ErrorCode.CATEGORY_ERROR_IN_USE,
      );
    }

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

  async autocomplete(query: FilterCategoryForm): Promise<Category[]> {
    const { name, page = 0, size = 10 } = query;

    const where: any = {};
    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }

    return await this.categoryRepository.findAll({
      where,
      limit: size,
      offset: page * size,
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
