import { Expose } from 'class-transformer';

export class AddressDto {
  @Expose()
  id: bigint;

  @Expose()
  detail: string;

  @Expose()
  city: string;

  @Expose()
  district: string;

  @Expose()
  ward: string;

  @Expose()
  hamlet: string;

  @Expose()
  longitude: number;

  @Expose()
  latitude: number;

  @Expose()
  isDefault: boolean;

  @Expose()
  accountId: bigint;

  @Expose()
  receiverName: string;

  @Expose()
  phoneNumber: string;
}
