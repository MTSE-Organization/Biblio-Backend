import { Expose } from 'class-transformer';

export class CheckReviewDto {
  @Expose()
  isReviewed: boolean;
}
