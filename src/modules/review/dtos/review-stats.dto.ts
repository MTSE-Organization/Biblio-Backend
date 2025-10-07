import { Expose } from 'class-transformer';

export class ReviewStatsDto {
  @Expose()
  total: number;

  @Expose()
  rate: number;
}
