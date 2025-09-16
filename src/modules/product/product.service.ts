import { Product } from '@/models/product.model';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateProductForm,
  FilterProductForm,
  UpdateProductForm
} from './forms';
import { NotFoundException } from '@/common/exceptions';
import { Category, Contributor, ProductImage, Publisher } from '@/models';
import { CategoryService } from '../category/category.service';
import { SlugifyUtil } from '@/utils';
import { Constant, ErrorCode } from '@/constants';
import { PublisherService } from '../publisher/publisher.service';
import { ContributorService } from '../contributor/contributor.service';
import { Op } from 'sequelize';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,

    private readonly publisherService: PublisherService,

    private readonly contributorService: ContributorService
  ) {}

  async create(form: CreateProductForm) {
    const { contributorsIds, ...rest } = form;
    await Promise.all([
      this.categoryService.findById(rest.categoryId),
      this.publisherService.findById(rest.publisherId)
    ]);

    const slug = SlugifyUtil.toSlugify(rest.name);
    const data = { slug: slug, ...rest };
    const product = await this.productRepository.create(data);
    const contributors =
      await this.contributorService.findByIds(contributorsIds);
    await product.$set('contributors', contributors);
    return { message: 'Create product successfully' };
  }

  async existsBy(field: keyof Product, value: any): Promise<boolean> {
    const count = await this.productRepository.count({
      where: { [field]: value }
    });
    return count > 0;
  }

  async update(form: UpdateProductForm) {
    const product = await this.findById(form.id);
    if (product.categoryId !== form.categoryId) {
      await this.categoryService.findById(form.categoryId);
      product.categoryId = form.categoryId;
    }
    if (product.publisherId !== form.publisherId) {
      await this.publisherService.findById(form.publisherId);
    }
    const slug = SlugifyUtil.toSlugify(form.name);
    const { categoryId, contributorsIds, ...data } = form;
    await product.update({ slug, ...data });
    const contributors =
      await this.contributorService.findByIds(contributorsIds);
    await product.$set('contributors', contributors);
    return { message: 'Update product successfully' };
  }

  async findAll(
    query: FilterProductForm
  ): Promise<{ products: Product[]; count: number }> {
    const { page, size } = query;
    const skip = page * size;

    const { rows, count } = await this.productRepository.findAndCountAll({
      limit: size,
      offset: skip,
      where: query.getFilter(),
      include: [
        { model: Category },
        {
          model: ProductImage,
          where: {
            [Op.or]: [{ isDefault: true }, { ordering: 0 }]
          },
          required: false,
          limit: 1,
          separate: true
        }
      ]
    });

    return { products: rows, count };
  }

  async findById(id: bigint): Promise<Product> {
    const product = await this.productRepository.findByPk(id);
    console.log(product?.contributors);

    if (!product) {
      throw new NotFoundException(
        'Product not found',
        ErrorCode.PRODUCT_ERROR_NOT_FOUND
      );
    }

    return product;
  }

  async findDetail(id: bigint, status?: number): Promise<Product> {
    const where: any = { id };
    if (status !== undefined) {
      where.status = status;
    }

    const product = await this.productRepository.findOne({
      where,
      include: [
        { model: Category },
        { model: ProductImage, separate: true, order: [['ordering', 'ASC']] },
        { model: Publisher },
        { model: Contributor, through: { attributes: [] } }
      ]
    });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
        ErrorCode.PRODUCT_ERROR_NOT_FOUND
      );
    }

    return product;
  }

  async findByIdAndStatus(
    id: bigint,
    status: number = Constant.STATUS_ACTIVE
  ): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id, status },
      include: [
        { model: Category },
        { model: ProductImage },
        { model: Publisher }
      ]
    });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
        ErrorCode.PRODUCT_ERROR_NOT_FOUND
      );
    }

    return product;
  }

  async delete(id: bigint) {
    const product = await this.findById(id);
    await product.update({ status: Constant.STATUS_DELETED });
    return { message: 'Delete product successfully' };
  }

  async findLatest(limit: number = 8) {
    return this.productRepository.findAll({
      limit,
      order: [['createdDate', 'DESC']],
      include: [{ model: Category }]
    });
  }

  async findBestSeller(limit: number = 6) {
    return this.productRepository.findAll({
      where: { isFeatured: true },
      limit,
      order: [['quantity', 'DESC']],
      include: [{ model: Category }]
    });
  }

  async findTopDiscount(limit: number = 4) {
    return this.productRepository.findAll({
      limit,
      order: [['price', 'DESC']],
      include: [{ model: Category }]
    });
  }
}
