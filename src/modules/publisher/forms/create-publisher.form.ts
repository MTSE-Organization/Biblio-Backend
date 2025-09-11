import { StringDecorator } from '@/common/decorators';

export class CreatePublisherForm {
  @StringDecorator('name', true)
  name: string;

  @StringDecorator('description')
  description: string;

  @StringDecorator('logoPath')
  logoPath: string;
}
