import { Expose } from 'class-transformer';

export class CreateOrderDto {
  @Expose()
  orderId: bigint;
}
