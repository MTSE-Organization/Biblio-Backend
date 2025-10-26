import { Constant } from '@/constants';
import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export const AccountKindDecorator = (
  name: string,
  required: boolean = false
) => {
  return applyDecorators(
    ApiProperty({
      required: required,
      type: Number,
      description: `${name} field`
    }),
    IsNumber({}, { message: `${name} must be a number` }),
    IsIn([Constant.ACCOUNT_KIND_ADMIN, Constant.ACCOUNT_KIND_EMPLOYEE], {
      message: `${name} invalid`
    }),
    ...(required
      ? [IsNotEmpty({ message: `${name} cannot be null or empty` })]
      : [IsOptional()])
  );
};
