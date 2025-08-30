import {
  BigIntArrayDecorator,
  BigIntDecorator,
  StringDecorator,
} from '@/common/decorators';

export class UpdateGroupForm {
  @BigIntDecorator('id', true)
  id: bigint;

  @StringDecorator('name', true)
  name: string;

  @StringDecorator('description', true)
  description: string;

  @BigIntArrayDecorator('permissionIds', true)
  permissionIds: [bigint];
}
