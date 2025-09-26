import { Product } from '@/models';
import { ViewedProduct } from '@/models/viewed-product.model';
import { ProductService } from '@/modules/product/product.service';
import { ViewedProductForm } from '@/modules/viewed-product/forms/viewed-product.form';
import { FilterViewedProductForm } from '@/modules/viewed-product/forms/filter-viewed-product.form';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException } from '@/common/exceptions';
import { ErrorCode } from '@/constants';

@Injectable()
export class ViewedProductService {
  constructor(
    @InjectModel(ViewedProduct)
    private readonly viewedProductRepository: typeof ViewedProduct,

    private readonly productService: ProductService
  ) {}

  async findAll(accountId: bigint, query: FilterViewedProductForm) {
    const { limit, offset } = query.getPagination();
    const { rows, count } = await this.viewedProductRepository.findAndCountAll({
      limit: limit,
      offset: offset,
      where: { accountId },
      order: [['viewedAt', 'DESC']],
      include: [
        {
          model: Product
        }
      ]
    });
    return { viewedProducts: rows, count };
  }

  async create(accountId: bigint, form: ViewedProductForm) {
    await this.productService.findById(form.productId);

    const viewedProduct = await this.viewedProductRepository.findOne({
      where: {
        accountId: accountId,
        productId: form.productId
      }
    });
    if (viewedProduct) {
      await viewedProduct.update({
        viewedAt: Date.now(),
        viewCount: Number(viewedProduct.viewCount) + 1
      });
    } else {
      await this.viewedProductRepository.create({
        accountId: accountId,
        productId: form.productId,
        viewedAt: Date.now(),
        viewCount: 1
      });
    }

    return { message: 'Create viewed product successfully' };
  }

  async delete(id: bigint) {
    const viewedProduct = await this.viewedProductRepository.findOne({
      where: {
        id
      }
    });
    if (!viewedProduct) {
      throw new BadRequestException(
        'Viewed product not found',
        ErrorCode.VIEWED_PRODUCT_ERROR_NOT_FOUND
      );
    }
    await viewedProduct.destroy();
    return { message: 'Delete viewed product successfully' };
  }
}
