import { Product } from '@/models/product.model';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateProductForm,
  FilterProductForm,
  UpdateProductForm,
} from './forms';
import { NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants/error-code.constant';
import { Category } from '@/models';
import { CategoryService } from '../category/category.service';
import { SlugifyUtil } from '@/utils';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}

  async create(form: CreateProductForm) {
    await this.categoryService.findById(form.categoryId);
    const slug = SlugifyUtil.toSlugify(form.name);
    const data = { slug: slug, ...form };
    await this.productRepository.create(data);
    return { message: 'Create product successfully' };
  }

  async existsBy(field: keyof Product, value: any): Promise<boolean> {
    const count = await this.productRepository.count({
      where: { [field]: value },
    });
    return count > 0;
  }

  async update(form: UpdateProductForm) {
    const product = await this.findById(form.id);
    if (product.categoryId !== form.categoryId) {
      await this.categoryService.findById(form.categoryId);
      product.categoryId = form.categoryId;
    }
    const slug = SlugifyUtil.toSlugify(form.name);
    const { categoryId, ...data } = form;
    await product.update({ slug, ...data });
    return { message: 'Update product successfully' };
  }

  async findAll(
    query: FilterProductForm,
  ): Promise<{ products: Product[]; count: number }> {
    const { page, size } = query;
    const skip = page * size;

    const { rows, count } = await this.productRepository.findAndCountAll({
      limit: size,
      offset: skip,
      include: [{ model: Category }],
    });
    return { products: rows, count };
  }

  async findById(id: bigint): Promise<Product> {
    const product = await this.productRepository.findByPk(id, {
      include: [{ model: Category }],
    });
    if (!product) {
      throw new NotFoundException(
        'Product not found',
        ErrorCode.PRODUCT_ERROR_NOT_FOUND,
      );
    }
    return product;
  }

  async delete(id: bigint) {
    const product = await this.findById(id);
    await product.destroy();
    return { message: 'Delete product successfully' };
  }

  async findLatest(limit: number = 8) {
    return this.productRepository.findAll({
      limit,
      order: [['createdDate', 'DESC']],
      include: [{ model: Category }],
    });
  }

  async findBestSeller(limit: number = 6) {
    return this.productRepository.findAll({
      where: { isFeatured: true },
      limit,
      order: [['quantity', 'DESC']],
      include: [{ model: Category }],
    });
  }

  async findTopDiscount(limit: number = 4) {
    return this.productRepository.findAll({
      limit,
      order: [['price', 'DESC']],
      include: [{ model: Category }],
    });
  }
}
