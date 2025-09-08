import { StringDecorator } from '@/common/decorators';

export class CreatePermissionGroupForm {
  @StringDecorator('name', true)
  name: string;
}
