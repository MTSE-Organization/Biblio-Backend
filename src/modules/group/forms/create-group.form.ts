import {
  BigIntArrayDecorator,
  NumberDecorator,
  StringDecorator,
} from '@/common/decorators';

export class CreateGroupForm {
  @StringDecorator('name', true)
  name: string;

  @StringDecorator('description', true)
  description: string;

  @NumberDecorator('kind', true)
  kind: number;

  @BigIntArrayDecorator('permissionIds', true)
  permissionIds: [bigint];
}
