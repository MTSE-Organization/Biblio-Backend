import { BigIntDecorator, StringDecorator } from '@/common/decorators';

export class CreatePermissionForm {
  @StringDecorator('name', true)
  name: string;

  @StringDecorator('description', true)
  description: string;

  @StringDecorator('pCode', true)
  pCode: string;

  @BigIntDecorator('permissionGroupId', true)
  permissionGroupId: bigint;
}
