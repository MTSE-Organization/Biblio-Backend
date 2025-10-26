import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from '@/models/review.model';
import { ReviewForm } from './forms/review.form';
import { FilterReviewForm } from './forms/filter-review.form';
import { Product, Account, ProductImage, Category } from '@/models';
import { NotFoundException } from '@/common/exceptions';
import { Constant, ErrorCode } from '@/constants';
import { ProductService } from '@/modules/product/product.service';
import { ReviewStatsDto } from './dtos';
import { Op, Sequelize } from 'sequelize';
import { FilterTopReviewForm } from './forms/filter-top-review.form';
import { ReviewTopRatedProductDto } from './dtos/review-top-rate-product.dto';
import { OrderService } from '@/modules/order/order.service';
import { CheckReviewForm } from '@/modules/review/forms';
import { ProductVariantService } from '@/modules/product-variant/product-variant.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review)
    private readonly reviewRepository: typeof Review,
    private readonly productService: ProductService,
    private readonly productVariantService: ProductVariantService,
    private readonly orderService: OrderService
  ) {}

  async findAll(query: FilterReviewForm) {
    const { limit, offset } = query.getPagination();

    const where: any = {};

    if (query.productId) {
      where.productId = query.productId;
    }

    if (query.fromDate || query.toDate) {
      where.createdDate = {};
      if (query.fromDate) {
        where.createdDate[Op.gte] = query.fromDate;
      }
      if (query.toDate) {
        where.createdDate[Op.lte] = query.toDate;
      }
    }

    const { rows, count } = await this.reviewRepository.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdDate', 'DESC']],
      include: [{ model: Product }, { model: Account }]
    });

    return { reviews: rows, count };
  }

  async create(accountId: bigint, form: ReviewForm) {
    await this.productService.findById(form.productId);

    await this.reviewRepository.create({
      accountId,
      ...form
    });

    await this.updateProductReviewStats(form.productId);

    return { message: 'Created review successfully' };
  }

  async delete(id: bigint, accountId: bigint) {
    const review = await this.reviewRepository.findOne({ where: { id } });

    if (!review || review.accountId !== accountId) {
      throw new NotFoundException(
        'Review not found or access denied',
        ErrorCode.REVIEW_ERROR_NOT_FOUND
      );
    }

    const productId = review.productId;

    await review.destroy();
    await this.updateProductReviewStats(productId);

    return { message: 'Delete review successfully' };
  }

  private async updateProductReviewStats(productId: bigint) {
    const reviews = await this.reviewRepository.findAll({
      where: { productId },
      attributes: ['rate']
    });

    const product = await this.productService.findById(productId);

    const total = reviews.length;
    const average =
      total > 0 ? reviews.reduce((sum, r) => sum + r.rate, 0) / total : 0;

    await product.update(
      {
        totalReviews: total,
        averageReview: average
      },
      { where: { id: productId } }
    );
  }

  async getReviewStats(productId: bigint): Promise<ReviewStatsDto[]> {
    const reviews = await this.reviewRepository.findAll({
      where: { productId },
      attributes: ['rate']
    });

    const rateMap = new Map<number, number>();

    for (let i = 1; i <= 5; i++) {
      rateMap.set(i, 0);
    }

    for (const r of reviews) {
      const current = rateMap.get(r.rate) ?? 0;
      rateMap.set(r.rate, current + 1);
    }

    const result: ReviewStatsDto[] = [];

    for (let i = 5; i >= 1; i--) {
      result.push({ rate: i, total: rateMap.get(i) ?? 0 });
    }

    return result;
  }

  async getTopRatedProducts(form: FilterTopReviewForm) {
    const rate = form.rate ?? 5;
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

    if (form.rate) {
      where.rate = rate;
    }

    const results = await this.reviewRepository.findAll({
      attributes: [
        'productId',
        [Sequelize.fn('AVG', Sequelize.col('Review.rate')), 'averageRating'],
        [Sequelize.fn('COUNT', Sequelize.col('Review.id')), 'totalReviews']
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
        'Review.product_id',
        'product.id',
        'product.name',
        'product.slug',
        'product.price',
        'product.average_review',
        'product.total_reviews',
        'product->images.id',
        'product->images.url',
        'product->category.id'
      ],
      order: [[Sequelize.literal('averageRating'), 'DESC']],
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
        image: r['product.images.url'] ?? null,
        category: {
          id: r['product.category.id'],
          name: r['product.category.name'],
          slug: r['product.category.slug']
        },
        averageRating: parseFloat(r['averageRating']).toFixed(2),
        totalReviews: r['totalReviews']
      }))
    };
  }

  async checkReview(form: CheckReviewForm, accountId: bigint) {
    const order = await this.orderService.findByIdAndAccount(
      form.orderId,
      accountId
    );

    if (!order) {
      throw new NotFoundException(
        'Order not found',
        ErrorCode.ORDER_ERROR_NOT_FOUND
      );
    }

    const productVariant = await this.productVariantService.findById(
      form.productVariantId
    );

    if (!productVariant) {
      throw new NotFoundException(
        'Product variant not found',
        ErrorCode.PRODUCT_VARIANT_ERROR_NOT_FOUND
      );
    }

    const product = await this.productService.findById(form.productId);

    if (!product) {
      throw new NotFoundException(
        'Product not found',
        ErrorCode.PRODUCT_ERROR_NOT_FOUND
      );
    }

    const review = await this.reviewRepository.findAll({
      where: {
        orderId: form.orderId,
        productId: form.productId,
        productVariantId: form.productVariantId
      }
    });

    return review.length > 0;
  }
}
