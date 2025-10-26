import {
  BigIntDecorator,
  EmailDecorator,
  StringDecorator
} from '@/common/decorators';

export class CreateEmployeeForm {
  @EmailDecorator('email', true)
  email: string;

  @StringDecorator('password', true)
  password: string;

  @StringDecorator('fullName')
  fullName: string | null = null;

  @StringDecorator('avatarPath')
  avatarPath: string | null = null;

  @StringDecorator('phone')
  phone: string | null = null;

  @BigIntDecorator('groupId', true)
  groupId: bigint;
}
