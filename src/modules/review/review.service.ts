import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from '@/models/review.model';
import { ReviewForm } from './forms/review.form';
import { FilterReviewForm } from './forms/filter-review.form';
import { Product, Account } from '@/models';
import { NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants';
import { ProductService } from '@/modules/product/product.service';
import { ReviewStatsDto } from './dtos';
import { Op, Sequelize } from 'sequelize';
import { FilterTopReviewForm } from './forms/filter-top-review.form';
import { ReviewTopRatedProductDto } from './dtos/review-top-rate-product.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review)
    private readonly reviewRepository: typeof Review,
    private readonly productService: ProductService
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

    const review = await this.reviewRepository.create({
      accountId,
      productId: form.productId,
      rate: form.rate,
      content: form.content
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

  async getTopRatedProducts(
    form: FilterTopReviewForm
  ): Promise<ReviewTopRatedProductDto[]> {
    const rate = form.rate ?? 5;
    const where: any = { rate };

    if (form.fromDate && form.toDate && form.toDate < form.fromDate) {
      throw new BadRequestException(
        'toDate must be greater than or equal to fromDate'
      );
    }

    if (form.fromDate || form.toDate) {
      where.createdDate = {};
      if (form.fromDate) where.createdDate[Op.gte] = form.fromDate;
      if (form.toDate) where.createdDate[Op.lte] = form.toDate;
    }

    const queryOptions: any = {
      where,
      attributes: [
        'productId',
        [Sequelize.fn('COUNT', Sequelize.col('Review.id')), 'starCount']
      ],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name']
        }
      ],
      group: ['productId', 'product.id', 'product.name'],
      order: [[Sequelize.literal('starCount'), 'DESC']]
    };

    if (form.top) {
      queryOptions.limit = form.top;
    }

    const topProducts = await this.reviewRepository.findAll(queryOptions);

    return topProducts.map((r: any) => ({
      productId: r.productId,
      productName: r.product.name,
      starCount: Number(r.getDataValue('starCount'))
    }));
  }
}
