import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { ProductImage } from '@/models';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ProductService } from '../product/product.service';
import { ErrorCode } from '@/constants';
import {
  CreateProductImageForm,
  FilterProductImageForm,
  UpdateDefaultImageForm
} from './form';
import { UpdateOrderingForm } from '@/common/forms';
import { FileService } from '../file/file.service';
import { Sequelize } from 'sequelize';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectModel(ProductImage)
    private readonly productImageRepository: typeof ProductImage,

    private readonly productService: ProductService,

    private readonly fileService: FileService,

    @InjectConnection()
    private readonly sequelize: Sequelize
  ) {}

  async create(form: CreateProductImageForm) {
    await this.productService.findById(form.productId);

    if (form.isDefault) {
      await this.clearDefaultImage(form.productId);
    }

    const maxOrderingImage = await this.productImageRepository.findOne({
      where: { productId: form.productId },
      order: [['ordering', 'DESC']]
    });

    const nextOrdering =
      maxOrderingImage?.ordering != null ? maxOrderingImage.ordering + 1 : 0;

    const productImage = await this.productImageRepository.create({
      ...form,
      ordering: nextOrdering
    });

    return { message: 'Create product image successfully' };
  }

  async delete(id: bigint) {
    const productImage = await this.findById(id);
    await this.fileService.deleteFile(productImage.url);
    await productImage.destroy();
    return { message: 'Delete product image successfully' };
  }

  async list(
    form: FilterProductImageForm
  ): Promise<{ productImages: ProductImage[]; count: number }> {
    const { limit, offset } = form.getPagination();

    const { rows, count } = await this.productImageRepository.findAndCountAll({
      where: form.getFilter(),
      limit: limit,
      offset: offset,
      order: [['ordering', 'ASC']]
    });
    return { productImages: rows, count: count };
  }

  async get(id: bigint): Promise<ProductImage> {
    return await this.findById(id);
  }

  async updateOrdering(
    forms: UpdateOrderingForm[]
  ): Promise<{ message: string }> {
    if (!forms || forms.length === 0) {
      throw new BadRequestException(
        'Input list cannot be empty',
        ErrorCode.PRODUCT_IMAGE_ERROR_INVALID_REQUEST
      );
    }

    const ids = forms.map((f) => BigInt(f.id));
    const productImages = await this.productImageRepository.findAll({
      where: { id: ids }
    });

    if (productImages.length !== ids.length) {
      throw new NotFoundException(
        'One or more product images not found',
        ErrorCode.PRODUCT_IMAGE_ERROR_NOT_FOUND
      );
    }

    const orderingMap = new Map<bigint, number>();
    for (const form of forms) {
      orderingMap.set(BigInt(form.id), form.ordering);
    }

    for (const image of productImages) {
      const newOrdering = orderingMap.get(image.id) as number;
      image.ordering = newOrdering;
      await image.save();
    }

    return { message: 'Update ordering product image success' };
  }

  private async findById(id: bigint): Promise<ProductImage> {
    const image = await this.productImageRepository.findByPk(id);
    if (!image) {
      throw new NotFoundException(
        'Product image not found',
        ErrorCode.PRODUCT_IMAGE_ERROR_NOT_FOUND
      );
    }
    return image;
  }

  async updateDefault(form: UpdateDefaultImageForm) {
    const { id } = form;
    const productImage = await this.findById(id);

    const transaction = await this.sequelize.transaction();
    try {
      await this.productImageRepository.update(
        { isDefault: false },
        { where: { productId: productImage.productId }, transaction }
      );

      await this.productImageRepository.update(
        { isDefault: true },
        { where: { id }, transaction }
      );

      await transaction.commit();
      return { message: 'Set default product image successfully' };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  private async clearDefaultImage(productId: bigint) {
    await this.productImageRepository.update(
      { isDefault: false },
      { where: { productId } }
    );
  }
}
