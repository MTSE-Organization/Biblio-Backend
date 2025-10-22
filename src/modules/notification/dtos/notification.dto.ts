import { Expose } from 'class-transformer';

export class NotificationDto {
  @Expose()
  id: bigint;

  @Expose()
  title: string;

  @Expose()
  imageUrl: string;

  @Expose()
  content: string;

  @Expose()
  accountId: bigint;

  @Expose()
  type: number;

  @Expose()
  data: string;

  @Expose()
  seen: boolean;

  @Expose()
  lastTimeRead: Date;

  @Expose()
  createdDate: Date;
}
