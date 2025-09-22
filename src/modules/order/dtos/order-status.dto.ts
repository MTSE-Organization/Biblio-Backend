import { Expose } from 'class-transformer';

export class OrderStatusDto {
  @Expose()
  id: bigint;

  @Expose()
  orderId: bigint;

  @Expose()
  createdDate: Date;

  @Expose()
  status: number;
}
