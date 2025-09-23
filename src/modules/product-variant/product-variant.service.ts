import { Injectable } from '@nestjs/common';
import {
  CreateProductVariantForm,
  FilterProductVariantForm,
  UpdateProductVariantForm
} from './forms';
import { InjectModel } from '@nestjs/sequelize';
import { Category, Product, ProductVariant } from '@/models';
import { ProductService } from '../product/product.service';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { Constant, ErrorCode } from '@/constants';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectModel(ProductVariant)
    private readonly productVariantRepository: typeof ProductVariant,

    private readonly productService: ProductService
  ) {}

  async create(form: CreateProductVariantForm) {
    await this.productService.findById(form.productId);
    if (
      await this.existsByConditionAndFormat({
        condition: form.condition,
        format: form.format,
        productId: form.productId
      })
    ) {
      throw new BadRequestException(
        'Product variant existed',
        ErrorCode.PRODUCT_VARIANT_ERROR_EXISTED
      );
    }
    await this.productVariantRepository.create({ ...form });
    return { message: 'Create product variant successfully' };
  }

  async findById(id: bigint): Promise<ProductVariant> {
    const product = await this.productVariantRepository.findByPk(id, {
      include: [
        {
          model: Product,
          include: [{ model: Category }]
        }
      ]
    });

    if (!product) {
      throw new NotFoundException(
        'Product variant not found',
        ErrorCode.PRODUCT_VARIANT_ERROR_NOT_FOUND
      );
    }

    return product;
  }

  async findByIdAndStatus(
    id: bigint,
    status: number = Constant.STATUS_ACTIVE
  ): Promise<ProductVariant> {
    const productVariant = await this.productVariantRepository.findOne({
      where: { id, status },
      include: [
        {
          model: Product,
          include: [{ model: Category }]
        }
      ]
    });

    if (!productVariant) {
      throw new NotFoundException(
        'Product variant not found',
        ErrorCode.PRODUCT_VARIANT_ERROR_NOT_FOUND
      );
    }

    return productVariant;
  }

  async findAll(
    query: FilterProductVariantForm
  ): Promise<{ productVariants: ProductVariant[]; count: number }> {
    const { limit, offset } = query.getPagination();

    const { rows, count } = await this.productVariantRepository.findAndCountAll(
      {
        limit: limit,
        offset: offset,
        where: query.getFilter()
      }
    );

    return { productVariants: rows, count };
  }

  async findByIds(ids: bigint[]): Promise<ProductVariant[]> {
    return this.productVariantRepository.findAll({
      where: { id: ids, status: Constant.STATUS_ACTIVE },
      include: [{ model: Product }]
    });
  }

  async update(form: UpdateProductVariantForm) {
    const { id, ...data } = form;
    const productVariant = await this.findById(id);
    if (
      (productVariant.condition !== form.condition ||
        productVariant.format !== form.format) &&
      (await this.existsByConditionAndFormat({
        condition: form.condition,
        format: form.format
      }))
    ) {
      throw new BadRequestException(
        'Product variant existed',
        ErrorCode.PRODUCT_VARIANT_ERROR_EXISTED
      );
    }
    await productVariant.update(data);
    return { message: 'Update product variant successfully' };
  }

  async recover(id: bigint) {
    const productVariant = await this.findById(id);
    if (!productVariant)
      throw new BadRequestException(
        'Product not found',
        ErrorCode.PRODUCT_VARIANT_ERROR_NOT_FOUND
      );
    await productVariant.update({ status: Constant.STATUS_ACTIVE });
    return { message: 'Recover product variant successfully' };
  }

  async delete(id: bigint) {
    const productVariant = await this.findById(id);
    await productVariant.update({ status: Constant.STATUS_DELETED });
    return { message: 'Delete product variant successfully' };
  }

  async existsByConditionAndFormat({
    condition,
    format,
    productId
  }: {
    productId?: bigint;
    condition: number;
    format: number;
  }): Promise<boolean> {
    const count = await this.productVariantRepository.count({
      where: { condition, format, productId: productId ?? null }
    });
    return count > 0;
  }
}
