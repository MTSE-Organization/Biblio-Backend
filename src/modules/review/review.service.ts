import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from '@/models/review.model';
import { ReviewForm } from './forms/review.form';
import { FilterReviewForm } from './forms/filter-review.form';
import { Product, Account } from '@/models';
import { NotFoundException } from '@/common/exceptions';
import { ErrorCode } from '@/constants';
import { ProductService } from '@/modules/product/product.service';
import { ReviewStatsDto } from './dtos';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review)
    private readonly reviewRepository: typeof Review,
    private readonly productService: ProductService
  ) {}

  async findAll(query: FilterReviewForm) {
    const { limit, offset } = query.getPagination();

    const { rows, count } = await this.reviewRepository.findAndCountAll({
      where: query.productId ? { productId: query.productId } : undefined,
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
    // await this.updateProductReviewStats(productId);

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
}
