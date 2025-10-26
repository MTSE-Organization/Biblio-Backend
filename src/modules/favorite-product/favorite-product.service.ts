import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FavoriteProduct } from '@/models/favorite-product.model';
import { FavoriteProductForm } from '@/modules/favorite-product/forms/favorite-product.form';
import { Account, Category, Product, ProductImage } from '@/models';
import { ProductService } from '@/modules/product/product.service';
import { FilterFavoriteProductForm } from '@/modules/favorite-product/forms/filter-favorite-product.form';
import { BadRequestException, NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants';
import { Op, Sequelize } from 'sequelize';
import { TopFavoriteFilterForm } from '@/modules/favorite-product/forms/top-favorite-filter.form';

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

  async getTopFavorite(form: TopFavoriteFilterForm) {
    const where: any = {};

    if (form.fromDate && form.toDate && form.toDate < form.fromDate) {
      throw new BadRequestException(
        'toDate must be greater than or equal to fromDate'
      );
    }

    if (form.fromDate || form.toDate) {
      where.createdAt = {};
      if (form.fromDate) where.createdAt[Op.gte] = form.fromDate;
      if (form.toDate) where.createdAt[Op.lte] = form.toDate;
    }

    const results = await this.favoriteProductRepository.findAll({
      attributes: [
        'productId',
        [
          Sequelize.fn('COUNT', Sequelize.col('FavoriteProduct.id')),
          'totalFavorites'
        ]
      ],
      where,
      include: [
        {
          model: Product,
          attributes: [
            'id',
            'name',
            'slug',
            'price',
            'discount',
            'averageReview',
            'totalReviews'
          ],
          include: [
            {
              model: ProductImage,
              attributes: ['url'],
              where: { isDefault: true },
              required: false
            },
            {
              model: Category,
              attributes: ['id', 'name', 'slug']
            }
          ]
        }
      ],
      group: [
        Sequelize.col('FavoriteProduct.product_id'),
        Sequelize.col('product.id'),
        Sequelize.col('product.name'),
        Sequelize.col('product.slug'),
        Sequelize.col('product.price'),
        Sequelize.col('product.average_review'),
        Sequelize.col('product.total_reviews'),
        Sequelize.col('product->images.id'),
        Sequelize.col('product->images.url'),
        Sequelize.col('product->category.id'),
        Sequelize.col('product->category.name'),
        Sequelize.col('product->category.slug')
      ],
      order: [[Sequelize.literal('totalFavorites'), 'DESC']],
      limit: 10,
      raw: true,
      subQuery: false
    });

    return {
      content: results.map((r: any) => ({
        productId: r['product.id'],
        name: r['product.name'],
        slug: r['product.slug'],
        price: parseFloat(r['product.price']),
        discount: parseFloat(r['product.discount']),
        image: r['product.images.url'] ?? null,
        category: {
          id: r['product.category.id'],
          name: r['product.category.name'],
          slug: r['product.category.slug']
        },
        averageRating: r['product.averageReview'],
        totalReviews: r['product.totalReviews'],
        totalFavorites: r['totalFavorites']
      }))
    };
  }
}
