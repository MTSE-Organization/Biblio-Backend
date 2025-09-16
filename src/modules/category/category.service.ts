import { Category } from '@/models';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants';
import { ProductService } from '../product/product.service';
import {
  CreateCategoryForm,
  FilterCategoryForm,
  UpdateCategoryForm
} from './form';
import { UpdateOrderingForm } from '@/common/forms';
import { SlugifyUtil } from '@/utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryRepository: typeof Category,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService
  ) {}

  async create(form: CreateCategoryForm) {
    if (await this.existsBy('name', form.name)) {
      throw new BadRequestException(
        'Category name already exists',
        ErrorCode.CATEGORY_ERROR_NAME_EXISTED
      );
    }

    const slug = SlugifyUtil.toSlugify(form.name);

    const maxOrderingCategory = await this.categoryRepository.findOne({
      order: [['ordering', 'DESC']]
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
      imageUrl: form.imageUrl
    });

    return { message: 'Create category successfully' };
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
        ErrorCode.CATEGORY_ERROR_NAME_EXISTED
      );
    }

    if (data.name && data.name !== category.name) {
      category.slug = SlugifyUtil.toSlugify(form.name);
    }

    category.set(data);

    await category.save();

    return { message: 'Update category successfully' };
  }

  async delete(id: bigint) {
    const category = await this.findById(id);

    const hasProducts = await this.productService.existsBy('categoryId', id);
    if (hasProducts) {
      throw new BadRequestException(
        'Cannot delete category because it is in use by one or more products',
        ErrorCode.CATEGORY_ERROR_IN_USE
      );
    }

    await category.destroy();
    return { message: 'Delete category successfully' };
  }

  async findAll(
    query?: FilterCategoryForm
  ): Promise<{ categories: Category[]; count: number }> {
    const { page = 0, size = 10 } = query || {};
    const skip = page * size;

    const { rows, count } = await this.categoryRepository.findAndCountAll({
      where: query?.getFilter(),
      limit: size,
      offset: skip,
      order: [['ordering', 'ASC']]
    });

    return { categories: rows, count };
  }

  async findById(id: bigint): Promise<Category> {
    const category = await this.categoryRepository.findByPk(id);
    if (!category) {
      throw new NotFoundException(
        'Category not found',
        ErrorCode.CATEGORY_ERROR_NOT_FOUND
      );
    }
    return category;
  }

  async findByIdAndStatus(id: bigint, status: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, status }
    });
    if (!category) {
      throw new NotFoundException(
        'Category not found',
        ErrorCode.CATEGORY_ERROR_NOT_FOUND
      );
    }
    return category;
  }

  async existsBy(field: keyof Category, value: any): Promise<boolean> {
    const count = await this.categoryRepository.count({
      where: { [field]: value }
    });
    return count > 0;
  }

  async autocomplete(query: FilterCategoryForm): Promise<Category[]> {
    const { page = 0, size = 10 } = query;

    return await this.categoryRepository.findAll({
      where: query.getFilter(),
      limit: size,
      offset: page * size,
      order: [['ordering', 'ASC']]
    });
  }

  async updateOrdering(
    forms: UpdateOrderingForm[]
  ): Promise<{ message: string }> {
    if (!forms || forms.length === 0) {
      throw new BadRequestException(
        'Input list cannot be empty',
        ErrorCode.CATEGORY_ERROR_INVALID_REQUEST
      );
    }

    const ids = forms.map((f) => BigInt(f.id));
    const categories = await this.categoryRepository.findAll({
      where: { id: ids }
    });

    if (categories.length !== ids.length) {
      throw new NotFoundException(
        'One or more categories not found',
        ErrorCode.CATEGORY_ERROR_NOT_FOUND
      );
    }

    const orderingMap = new Map<bigint, number>();
    for (const form of forms) {
      orderingMap.set(form.id, form.ordering);
    }

    for (const category of categories) {
      const newOrdering = orderingMap.get(category.id) as number;
      category.ordering = newOrdering;
      await category.save();
    }

    return { message: 'Update ordering category success' };
  }
}
