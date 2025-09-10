import { BigIntDecorator, StringDecorator } from '@/common/decorators';

export class UpdatePublisherForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('name', true)
  name: string;

  @StringDecorator('description')
  description: string;

  @StringDecorator('logoPath')
  logoPath: string;
}
