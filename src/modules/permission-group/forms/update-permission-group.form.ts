import { BigIntDecorator, StringDecorator } from '@/common/decorators';

export class UpdatePermissionGroupForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('name', true)
  name: string;
}
