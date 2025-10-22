import { Expose } from 'class-transformer';

export class CountNotificationDto {
  @Expose()
  count: number;
}
