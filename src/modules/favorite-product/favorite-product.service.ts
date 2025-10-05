import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FavoriteProduct } from '@/models/favorite-product.model';
import { FavoriteProductForm } from '@/modules/favorite-product/forms/favorite-product.form';
import { Account, Category, Product, ProductImage } from '@/models';
import { ProductService } from '@/modules/product/product.service';
import { FilterFavoriteProductForm } from '@/modules/favorite-product/forms/filter-favorite-product.form';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants';
import { Op } from 'sequelize';

@Injectable()
export class FavoriteProductService {
  constructor(
    @InjectModel(FavoriteProduct)
    private readonly favoriteProductRepository: typeof FavoriteProduct,
    private readonly productService: ProductService
  ) {}

  async findAll(accountId: bigint, query: FilterFavoriteProductForm) {
    const { limit, offset } = query.getPagination();

    const { rows, count } =
      await this.favoriteProductRepository.findAndCountAll({
        limit: limit,
        offset: offset,
        where: { accountId, ...query.getFilter() },
        order: [['createdDate', 'DESC']],
        include: [
          {
            model: Product,
            include: [
              {
                model: ProductImage,
                where: {
                  [Op.or]: [{ isDefault: true }, { ordering: 0 }]
                },
                required: false,
                limit: 1,
                separate: true
              },
              { model: Category }
            ]
          }
        ]
      });
    return { favoriteProducts: rows, count };
  }

  async create(accountId: bigint, form: FavoriteProductForm) {
    await this.productService.findById(form.productId);

    const favorite = await this.favoriteProductRepository.findOne({
      where: {
        accountId: accountId,
        productId: form.productId
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
      accountId: accountId
    });

    return { message: 'Create favorite product successfully' };
  }

  async delete(id: bigint) {
    const favorite = await this.favoriteProductRepository.findOne({
      where: {
        id
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
