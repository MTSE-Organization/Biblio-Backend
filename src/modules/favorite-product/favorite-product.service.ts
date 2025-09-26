import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FavoriteProduct } from '@/models/favorite-product.model';
import { FavoriteProductForm } from '@/modules/favorite-product/forms/favorite-product.form';
import { Account, Product, ProductVariant } from '@/models';
import { ProductService } from '@/modules/product/product.service';
import { ProductVariantService } from '@/modules/product-variant/product-variant.service';
import { FilterFavoriteProductForm } from '@/modules/favorite-product/forms/filter-favorite-product.form';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants';

@Injectable()
export class FavoriteProductService {
  constructor(
    @InjectModel(FavoriteProduct)
    private readonly favoriteProductRepository: typeof FavoriteProduct,
    private readonly productService: ProductService,
    private readonly productVariantService: ProductVariantService
  ) {}

  async findAll(accountId: bigint, query: FilterFavoriteProductForm) {
    const { limit, offset } = query.getPagination();

    const { rows, count } =
      await this.favoriteProductRepository.findAndCountAll({
        limit: limit,
        offset: offset,
        where: { accountId },
        order: [['createdDate', 'DESC']],
        include: [
          {
            model: Product
          },
          {
            model: ProductVariant
          },
          { model: Account }
        ]
      });
    return { favoriteProducts: rows, count };
  }

  async add(form: FavoriteProductForm) {
    await this.productService.findById(form.productId);

    await this.productVariantService.findById(form.productVariantId);

    const favorite = await this.favoriteProductRepository.findOne({
      where: {
        accountId: form.accountId,
        productId: form.productId,
        productVariantId: form.productVariantId
      }
    });

    if (favorite) {
      throw new BadRequestException(
        'Favorite product exists',
        ErrorCode.FAVORITE_PRODUCT_ERROR_EXISTS
      );
    }

    await this.favoriteProductRepository.create({
      productId: form.productId,
      productVariantId: form.productVariantId,
      accountId: form.accountId
    });

    return { message: 'Add favorite product successfully' };
  }

  async delete(accountId: bigint, productId: bigint, productVariantId: bigint) {
    const favorite = await this.favoriteProductRepository.findOne({
      where: {
        accountId,
        productId,
        productVariantId
      }
    });

    if (!favorite) {
      throw new NotFoundException(
        'Favorite product not found',
        ErrorCode.FAVORITE_PRODUCT_ERROR_NOT_FOUND
      );
    }

    await favorite.destroy();

    return { message: 'Delete favorite product successfully' };
  }
}
